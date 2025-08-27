"""
WebSocket connection manager for real-time log streaming
"""

from fastapi import WebSocket
from typing import Dict, List, Set
import asyncio
import logging

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        # Store active connections for training jobs
        self.training_connections: Dict[str, Set[WebSocket]] = {}
        # Store active connections for evaluation jobs
        self.evaluation_connections: Dict[str, Set[WebSocket]] = {}

    async def connect_training_logs(self, job_id: str, websocket: WebSocket):
        """Connect a websocket to training job logs"""
        if job_id not in self.training_connections:
            self.training_connections[job_id] = set()

        self.training_connections[job_id].add(websocket)
        logger.info(f"WebSocket connected to training job {job_id}")

    async def disconnect_training_logs(self, job_id: str, websocket: WebSocket):
        """Disconnect a websocket from training job logs"""
        if job_id in self.training_connections:
            self.training_connections[job_id].discard(websocket)
            if not self.training_connections[job_id]:
                del self.training_connections[job_id]

        logger.info(f"WebSocket disconnected from training job {job_id}")

    async def connect_evaluation_logs(self, job_id: str, websocket: WebSocket):
        """Connect a websocket to evaluation job logs"""
        if job_id not in self.evaluation_connections:
            self.evaluation_connections[job_id] = set()

        self.evaluation_connections[job_id].add(websocket)
        logger.info(f"WebSocket connected to evaluation job {job_id}")

    async def disconnect_evaluation_logs(self, job_id: str, websocket: WebSocket):
        """Disconnect a websocket from evaluation job logs"""
        if job_id in self.evaluation_connections:
            self.evaluation_connections[job_id].discard(websocket)
            if not self.evaluation_connections[job_id]:
                del self.evaluation_connections[job_id]

        logger.info(f"WebSocket disconnected from evaluation job {job_id}")

    async def broadcast_training_log(self, job_id: str, message: str):
        """Broadcast a log message to all connected training job websockets"""
        if job_id not in self.training_connections:
            return

        # Create a copy of the set to avoid modification during iteration
        connections = self.training_connections[job_id].copy()

        for websocket in connections:
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error sending training log to websocket: {e}")
                # Remove failed connection
                self.training_connections[job_id].discard(websocket)

    async def broadcast_evaluation_log(self, job_id: str, message: str):
        """Broadcast a log message to all connected evaluation job websockets"""
        if job_id not in self.evaluation_connections:
            return

        # Create a copy of the set to avoid modification during iteration
        connections = self.evaluation_connections[job_id].copy()

        for websocket in connections:
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error sending evaluation log to websocket: {e}")
                # Remove failed connection
                self.evaluation_connections[job_id].discard(websocket)

    async def send_training_log(self, job_id: str, data: dict):
        """Send a structured log message to all connected training job websockets"""
        import json
        message = json.dumps(data)
        await self.broadcast_training_log(job_id, message)

    async def send_evaluation_log(self, job_id: str, data: dict):
        """Send a structured log message to all connected evaluation job websockets"""
        import json
        message = json.dumps(data)
        await self.broadcast_evaluation_log(job_id, message)

    async def broadcast(self, data: dict):
        """Broadcast a message to all connected websockets (both training and evaluation)"""
        import json
        message = json.dumps(data)

        # Broadcast to all training connections
        all_training_connections = set()
        for connections in self.training_connections.values():
            all_training_connections.update(connections)

        # Broadcast to all evaluation connections
        all_evaluation_connections = set()
        for connections in self.evaluation_connections.values():
            all_evaluation_connections.update(connections)

        # Combine all connections and remove duplicates
        all_connections = all_training_connections.union(all_evaluation_connections)

        for websocket in all_connections:
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting message to websocket: {e}")
                # Remove failed connections from all collections
                for job_connections in self.training_connections.values():
                    job_connections.discard(websocket)
                for job_connections in self.evaluation_connections.values():
                    job_connections.discard(websocket)

    def get_training_connection_count(self, job_id: str) -> int:
        """Get the number of active connections for a training job"""
        return len(self.training_connections.get(job_id, set()))

    def get_evaluation_connection_count(self, job_id: str) -> int:
        """Get the number of active connections for an evaluation job"""
        return len(self.evaluation_connections.get(job_id, set()))
