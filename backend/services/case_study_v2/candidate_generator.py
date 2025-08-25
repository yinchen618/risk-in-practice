"""
Candidate Generator Service
Handles Stage 1: Candidate Generation from raw data
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List
import random
import uuid

from .models import FilteringParameters
from .database import DatabaseManager

logger = logging.getLogger(__name__)

class CandidateGenerator:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    async def generate_candidates(self, experiment_run_id: str, filtering_params: FilteringParameters):
        """
        Generate anomaly candidates based on filtering parameters
        This is a background task that simulates the candidate generation process
        """
        logger.info(f"Starting candidate generation for experiment {experiment_run_id}")

        try:
            # Update experiment status to indicate generation is starting
            await self.db_manager.update_experiment_run_status(
                experiment_run_id,
                'CONFIGURING'
            )

            # Simulate data processing delay
            await asyncio.sleep(2)

            # Apply filtering rules and generate candidates
            candidates = await self._apply_filtering_rules(filtering_params)

            # Create anomaly events in database
            for candidate in candidates:
                await self.db_manager.create_anomaly_event(
                    event_id=candidate['event_id'],
                    meter_id=candidate['meter_id'],
                    event_timestamp=candidate['event_timestamp'],
                    detection_rule=candidate['detection_rule'],
                    score=candidate['score'],
                    data_window=candidate['data_window'],
                    experiment_run_id=experiment_run_id
                )

            # Update experiment run with candidate statistics
            stats = {
                'candidate_count': len(candidates),
                'positive_label_count': 0,
                'negative_label_count': 0,
                'detection_rules_used': list(set([c['detection_rule'] for c in candidates])),
                'score_distribution': self._calculate_score_distribution(candidates)
            }

            await self.db_manager.update_experiment_run_status(
                experiment_run_id,
                'LABELING',
                stats
            )

            logger.info(f"Candidate generation completed for experiment {experiment_run_id}. Generated {len(candidates)} candidates.")

        except Exception as e:
            logger.error(f"Error in candidate generation for experiment {experiment_run_id}: {str(e)}")
            await self.db_manager.update_experiment_run_status(
                experiment_run_id,
                'CONFIGURING'  # Reset to configuring state on error
            )

    async def _apply_filtering_rules(self, params: FilteringParameters) -> List[Dict[str, Any]]:
        """
        Apply filtering rules to generate candidate anomalies
        This is a simulation - in a real implementation, this would query actual data
        """
        candidates = []

        # Simulate processing different rule types
        rule_types = [
            "POWER_SPIKE_DETECTION",
            "UNUSUAL_CONSUMPTION_PATTERN",
            "DATA_INTEGRITY_VIOLATION",
            "PEER_DEVIATION_ANALYSIS"
        ]

        # Generate random candidates for demonstration
        num_candidates = random.randint(20, 100)

        for i in range(num_candidates):
            # Generate random timestamp within the specified range
            time_range = params.end_date - params.start_date
            random_time = params.start_date + timedelta(
                seconds=random.randint(0, int(time_range.total_seconds()))
            )

            # Skip weekends if specified
            if params.exclude_weekends and random_time.weekday() >= 5:
                continue

            # Generate candidate data
            candidate = {
                'event_id': f"evt_{uuid.uuid4().hex[:8]}",
                'meter_id': self._generate_meter_id(params),
                'event_timestamp': random_time,
                'detection_rule': random.choice(rule_types),
                'score': random.uniform(0.1, 1.0),
                'data_window': self._generate_data_window(random_time, params)
            }

            # Apply threshold filtering
            if self._passes_filtering_criteria(candidate, params):
                candidates.append(candidate)

        # Sort by score (highest first)
        candidates.sort(key=lambda x: x['score'], reverse=True)

        return candidates

    def _generate_meter_id(self, params: FilteringParameters) -> str:
        """Generate a meter ID based on selected scope"""
        if params.buildings:
            building = random.choice(params.buildings)
        else:
            building = f"Building_{random.randint(1, 5)}"

        if params.floors:
            floor = random.choice(params.floors)
        else:
            floor = f"Floor_{random.randint(1, 10)}"

        if params.rooms:
            room = random.choice(params.rooms)
        else:
            room = f"Room_{random.randint(1, 20)}"

        return f"{building}_{floor}_{room}_L{random.randint(1, 2)}"

    def _generate_data_window(self, timestamp: datetime, params: FilteringParameters) -> Dict[str, Any]:
        """Generate time series data window around the event"""
        window_hours = params.time_window_hours
        start_time = timestamp - timedelta(hours=window_hours//2)

        # Generate synthetic time series data
        data_points = []
        current_time = start_time

        for i in range(window_hours * 4):  # 15-minute intervals
            # Simulate power consumption with anomaly spike at event time
            base_power = random.uniform(100, 1000)

            # Add spike if close to event time
            if abs((current_time - timestamp).total_seconds()) < 900:  # Within 15 minutes
                power = base_power * random.uniform(2, 5)  # Spike
            else:
                power = base_power * random.uniform(0.8, 1.2)  # Normal variation

            data_points.append({
                'timestamp': current_time.isoformat(),
                'power_l1': power * 0.6,
                'power_l2': power * 0.4,
                'total_power': power
            })

            current_time += timedelta(minutes=15)

        return {
            'event_timestamp': timestamp.isoformat(),
            'window_start': start_time.isoformat(),
            'window_end': (start_time + timedelta(hours=window_hours)).isoformat(),
            'data_points': data_points,
            'sampling_interval': '15min'
        }

    def _passes_filtering_criteria(self, candidate: Dict[str, Any], params: FilteringParameters) -> bool:
        """Check if candidate passes all filtering criteria"""
        # Check power thresholds
        max_power = max([dp['total_power'] for dp in candidate['data_window']['data_points']])
        if max_power < params.power_threshold_min or max_power > params.power_threshold_max:
            return False

        # Check spike detection threshold
        avg_power = sum([dp['total_power'] for dp in candidate['data_window']['data_points']]) / len(candidate['data_window']['data_points'])
        if max_power / avg_power < params.spike_detection_threshold:
            return False

        # Check minimum data points
        if len(candidate['data_window']['data_points']) < params.min_data_points:
            return False

        return True

    def _calculate_score_distribution(self, candidates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate score distribution statistics"""
        if not candidates:
            return {}

        scores = [c['score'] for c in candidates]
        return {
            'min': min(scores),
            'max': max(scores),
            'mean': sum(scores) / len(scores),
            'count': len(scores),
            'high_score_count': len([s for s in scores if s > 0.7]),
            'medium_score_count': len([s for s in scores if 0.4 <= s <= 0.7]),
            'low_score_count': len([s for s in scores if s < 0.4])
        }
