"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface D3ParameterChartProps {
	parameterType:
		| "spike"
		| "zscore"
		| "duration"
		| "timegap"
		| "peer"
		| "weekendHoliday";
	threshold: number;
	enabled?: boolean; // For checkbox parameters like weekendHoliday
	width?: number;
	height?: number;
}

export function D3ParameterChart({
	parameterType,
	threshold,
	enabled = true,
	width = 180,
	height = 100,
}: D3ParameterChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const margin = { top: 15, right: 15, bottom: 15, left: 15 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// 添加背景
		g.append("rect")
			.attr("width", innerWidth)
			.attr("height", innerHeight)
			.attr("fill", "#ffffff")
			.attr("stroke", "#e5e7eb")
			.attr("stroke-width", 1)
			.attr("rx", 4);

		// 根據不同參數類型渲染不同的圖表
		switch (parameterType) {
			case "spike":
				renderSpikeChart(g, innerWidth, innerHeight, threshold);
				break;
			case "zscore":
				renderZScoreChart(g, innerWidth, innerHeight, threshold);
				break;
			case "duration":
				renderDurationChart(g, innerWidth, innerHeight, threshold);
				break;
			case "weekendHoliday":
				renderWeekendHolidayChart(g, innerWidth, innerHeight, enabled);
				break;
			case "timegap":
				renderTimeGapChart(g, innerWidth, innerHeight, threshold);
				break;
			case "peer":
				renderPeerChart(g, innerWidth, innerHeight, threshold);
				break;
		}
	}, [parameterType, threshold, enabled, width, height]);

	// A-1. Spike Threshold Chart
	const renderSpikeChart = (
		g: any,
		width: number,
		height: number,
		spikeThreshold: number,
	) => {
		const baseline = 50;
		const thresholdValue = baseline * (1 + spikeThreshold / 100);

		// Sample data with spikes
		const dataPoints = [
			52, 48, 51, 150, 53, 49, 52, 210, 50, 180, 51, 48, 52, 250, 49,
		];

		const xScale = d3
			.scaleLinear()
			.domain([0, dataPoints.length - 1])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([
				0,
				Math.max(Math.max(...dataPoints), thresholdValue) * 1.1,
			])
			.range([height, 0]);

		// Baseline
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(baseline))
			.attr("y2", yScale(baseline))
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 2);

		g.append("text")
			.attr("x", 5)
			.attr("y", yScale(baseline) - 3)
			.attr("font-size", "10px")
			.attr("fill", "#6b7280")
			.text("Baseline");

		// Threshold line
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(thresholdValue))
			.attr("y2", yScale(thresholdValue))
			.attr("stroke", "#f97316")
			.attr("stroke-width", 1.5)
			.attr("stroke-dasharray", "4,2");

		// Data line
		const line = d3
			.line<number>()
			.x((_, i) => xScale(i))
			.y((d) => yScale(d))
			.curve(d3.curveMonotoneX);

		g.append("path")
			.datum(dataPoints)
			.attr("fill", "none")
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2)
			.attr("d", line);

		// Highlight anomalous spikes
		let anomalyCount = 0;
		dataPoints.forEach((value, i) => {
			if (value > thresholdValue) {
				anomalyCount++;
				g.append("circle")
					.attr("cx", xScale(i))
					.attr("cy", yScale(value))
					.attr("r", 3)
					.attr("fill", "#f97316")
					.attr("stroke", "#ea580c")
					.attr("stroke-width", 1);
			}
		});

		// Anomaly counter
		g.append("text")
			.attr("x", width - 5)
			.attr("y", 12)
			.attr("text-anchor", "end")
			.attr("font-size", "9px")
			.attr("fill", "#f97316")
			.attr("font-weight", "600")
			.text(`Captured: ${anomalyCount}`);
	};

	// A-2. Z-Score Chart
	const renderZScoreChart = (
		g: any,
		width: number,
		height: number,
		zThreshold: number,
	) => {
		// Generate normal distribution data with some outliers
		const dataPoints = [
			0.2, -0.5, 0.8, 2.8, -0.3, 0.6, -1.2, 3.5, 0.1, -2.1, 0.4, -0.7,
			4.2, 0.3, -0.9,
		];

		const xScale = d3
			.scaleLinear()
			.domain([0, dataPoints.length - 1])
			.range([0, width]);

		const yExtent = d3.extent(dataPoints) as [number, number];
		const yScale = d3
			.scaleLinear()
			.domain([
				Math.min(yExtent[0], -zThreshold) - 0.5,
				Math.max(yExtent[1], zThreshold) + 0.5,
			])
			.range([height, 0]);

		// Zero line
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(0))
			.attr("y2", yScale(0))
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 1);

		// Upper and lower threshold lines
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(zThreshold))
			.attr("y2", yScale(zThreshold))
			.attr("stroke", "#f97316")
			.attr("stroke-width", 1.5)
			.attr("stroke-dasharray", "3,2");

		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(-zThreshold))
			.attr("y2", yScale(-zThreshold))
			.attr("stroke", "#f97316")
			.attr("stroke-width", 1.5)
			.attr("stroke-dasharray", "3,2");

		// Data points
		let anomalyCount = 0;
		dataPoints.forEach((value, i) => {
			const isAnomaly = Math.abs(value) > zThreshold;
			if (isAnomaly) {
				anomalyCount++;
			}

			g.append("circle")
				.attr("cx", xScale(i))
				.attr("cy", yScale(value))
				.attr("r", isAnomaly ? 3 : 2)
				.attr("fill", isAnomaly ? "#f97316" : "#3b82f6")
				.attr("stroke", isAnomaly ? "#ea580c" : "#2563eb")
				.attr("stroke-width", 1);
		});

		// Anomaly counter
		g.append("text")
			.attr("x", width - 5)
			.attr("y", 12)
			.attr("text-anchor", "end")
			.attr("font-size", "9px")
			.attr("fill", "#f97316")
			.attr("font-weight", "600")
			.text(`Captured: ${anomalyCount}`);
	};

	// B-1. Duration Chart
	const renderDurationChart = (
		g: any,
		width: number,
		height: number,
		minDuration: number,
	) => {
		const baseline = 30;
		// Simulate data with short spike and long anomaly
		const dataSegments = [
			{ start: 0, end: 3, height: baseline, type: "normal" },
			{ start: 3, end: 4, height: 80, type: "short" }, // 5 min spike
			{ start: 4, end: 7, height: baseline, type: "normal" },
			{ start: 7, end: 12, height: 70, type: "long" }, // 25 min anomaly
			{ start: 12, end: 15, height: baseline, type: "normal" },
		];

		const xScale = d3.scaleLinear().domain([0, 15]).range([0, width]);

		const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

		// Baseline
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(baseline))
			.attr("y2", yScale(baseline))
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 1);

		// Draw segments
		dataSegments.forEach((segment) => {
			const segmentWidth = xScale(segment.end) - xScale(segment.start);
			const timeMinutes = (segment.end - segment.start) * 5; // Each point = 5 minutes

			let fillColor = "#dbeafe"; // Default light blue for anomalies
			let strokeColor = "#3b82f6";

			if (segment.type === "long" && timeMinutes >= minDuration) {
				fillColor = "rgba(249, 115, 22, 0.5)"; // Orange for captured
				strokeColor = "#f97316";
			} else if (segment.type === "short" && timeMinutes >= minDuration) {
				fillColor = "rgba(249, 115, 22, 0.5)";
				strokeColor = "#f97316";
			}

			if (segment.height > baseline) {
				g.append("rect")
					.attr("x", xScale(segment.start))
					.attr("y", yScale(segment.height))
					.attr("width", segmentWidth)
					.attr("height", yScale(baseline) - yScale(segment.height))
					.attr("fill", fillColor)
					.attr("stroke", strokeColor)
					.attr("stroke-width", 1);
			}
		});

		// Count captured events
		const capturedCount = dataSegments.filter(
			(s) => s.height > baseline && (s.end - s.start) * 5 >= minDuration,
		).length;

		g.append("text")
			.attr("x", width - 5)
			.attr("y", 12)
			.attr("text-anchor", "end")
			.attr("font-size", "9px")
			.attr("fill", "#f97316")
			.attr("font-weight", "600")
			.text(`Captured: ${capturedCount}`);
	};

	// B-2. Weekend/Holiday Pattern Chart
	const renderWeekendHolidayChart = (
		g: any,
		width: number,
		height: number,
		patternEnabled: boolean,
	) => {
		const weekdayNormal = { min: 40, max: 80 };
		const holidayNormal = { min: 20, max: 40 };

		// Data with holiday spike
		const timeSegments = [
			{ start: 0, end: 5, type: "weekday", value: 60 },
			{ start: 5, end: 10, type: "holiday", value: 65 }, // Holiday spike
			{ start: 10, end: 15, type: "weekday", value: 55 },
		];

		const xScale = d3.scaleLinear().domain([0, 15]).range([0, width]);

		const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

		// Normal bands
		g.append("rect")
			.attr("x", 0)
			.attr("y", yScale(weekdayNormal.max))
			.attr("width", width * 0.33)
			.attr(
				"height",
				yScale(weekdayNormal.min) - yScale(weekdayNormal.max),
			)
			.attr("fill", "rgba(161, 161, 170, 0.3)")
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 1);

		g.append("text")
			.attr("x", width * 0.165)
			.attr("y", yScale(weekdayNormal.max) - 3)
			.attr("text-anchor", "middle")
			.attr("font-size", "8px")
			.attr("fill", "#6b7280")
			.text("Weekday Normal");

		g.append("rect")
			.attr("x", width * 0.33)
			.attr("y", yScale(holidayNormal.max))
			.attr("width", width * 0.34)
			.attr(
				"height",
				yScale(holidayNormal.min) - yScale(holidayNormal.max),
			)
			.attr("fill", "rgba(161, 161, 170, 0.2)")
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 1);

		g.append("text")
			.attr("x", width * 0.5)
			.attr("y", yScale(holidayNormal.max) - 3)
			.attr("text-anchor", "middle")
			.attr("font-size", "8px")
			.attr("fill", "#6b7280")
			.text("Holiday Normal");

		g.append("rect")
			.attr("x", width * 0.67)
			.attr("y", yScale(weekdayNormal.max))
			.attr("width", width * 0.33)
			.attr(
				"height",
				yScale(weekdayNormal.min) - yScale(weekdayNormal.max),
			)
			.attr("fill", "rgba(161, 161, 170, 0.3)")
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 1);

		// Data line and points
		let anomalyCount = 0;
		timeSegments.forEach((segment) => {
			const x = xScale((segment.start + segment.end) / 2);
			const y = yScale(segment.value);

			let isAnomaly = false;
			if (
				patternEnabled &&
				segment.type === "holiday" &&
				(segment.value > holidayNormal.max ||
					segment.value < holidayNormal.min)
			) {
				isAnomaly = true;
				anomalyCount++;
			}

			g.append("circle")
				.attr("cx", x)
				.attr("cy", y)
				.attr("r", isAnomaly ? 4 : 3)
				.attr("fill", isAnomaly ? "#f97316" : "#3b82f6")
				.attr("stroke", isAnomaly ? "#ea580c" : "#2563eb")
				.attr("stroke-width", 2);
		});

		g.append("text")
			.attr("x", width - 5)
			.attr("y", 12)
			.attr("text-anchor", "end")
			.attr("font-size", "9px")
			.attr("fill", patternEnabled ? "#f97316" : "#6b7280")
			.attr("font-weight", "600")
			.text(`${patternEnabled ? "Enabled" : "Disabled"}`);
	};

	// C-1. Time Gap Chart
	const renderTimeGapChart = (
		g: any,
		width: number,
		height: number,
		maxGap: number,
	) => {
		const gapDuration = 90; // minutes
		const dataValue = 50;

		const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

		const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

		// Data line with gap
		g.append("path")
			.attr(
				"d",
				`M 0,${yScale(dataValue)} L ${xScale(30)},${yScale(dataValue)}`,
			)
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2)
			.attr("fill", "none");

		g.append("path")
			.attr(
				"d",
				`M ${xScale(70)},${yScale(dataValue)} L ${width},${yScale(dataValue)}`,
			)
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2)
			.attr("fill", "none");

		// Gap indicator
		const gapColor = gapDuration > maxGap ? "#f97316" : "#6b7280";

		g.append("line")
			.attr("x1", xScale(30))
			.attr("x2", xScale(70))
			.attr("y1", yScale(dataValue))
			.attr("y2", yScale(dataValue))
			.attr("stroke", gapColor)
			.attr("stroke-width", 2)
			.attr("stroke-dasharray", "4,2");

		// Arrow indicators
		g.append("polygon")
			.attr(
				"points",
				`${xScale(30)},${yScale(dataValue) - 3} ${xScale(30) + 5},${yScale(dataValue)} ${xScale(30)},${yScale(dataValue) + 3}`,
			)
			.attr("fill", gapColor);

		g.append("polygon")
			.attr(
				"points",
				`${xScale(70)},${yScale(dataValue) - 3} ${xScale(70) - 5},${yScale(dataValue)} ${xScale(70)},${yScale(dataValue) + 3}`,
			)
			.attr("fill", gapColor);

		// Gap label
		g.append("text")
			.attr("x", xScale(50))
			.attr("y", yScale(dataValue) - 8)
			.attr("text-anchor", "middle")
			.attr("font-size", "9px")
			.attr("fill", gapColor)
			.attr("font-weight", "600")
			.text(`Gap: ${gapDuration}min`);

		// Status
		g.append("text")
			.attr("x", width - 5)
			.attr("y", 12)
			.attr("text-anchor", "end")
			.attr("font-size", "9px")
			.attr("fill", gapColor)
			.attr("font-weight", "600")
			.text(gapDuration > maxGap ? "Anomaly" : "Normal");
	};

	// D-1. Peer Comparison Chart
	const renderPeerChart = (
		g: any,
		width: number,
		height: number,
		exceedThreshold: number,
	) => {
		const peerAverage = 50;
		const thresholdValue = peerAverage * (1 + exceedThreshold / 100);

		const dataPoints = [
			52, 48, 51, 53, 49, 52, 85, 50, 51, 48, 52, 120, 49, 50, 51,
		];

		const xScale = d3
			.scaleLinear()
			.domain([0, dataPoints.length - 1])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([
				0,
				Math.max(Math.max(...dataPoints), thresholdValue) * 1.1,
			])
			.range([height, 0]);

		// Peer average line
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(peerAverage))
			.attr("y2", yScale(peerAverage))
			.attr("stroke", "#a1a1aa")
			.attr("stroke-width", 3);

		g.append("text")
			.attr("x", 5)
			.attr("y", yScale(peerAverage) - 3)
			.attr("font-size", "9px")
			.attr("fill", "#6b7280")
			.text("Peer Average");

		// Threshold line
		g.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", yScale(thresholdValue))
			.attr("y2", yScale(thresholdValue))
			.attr("stroke", "#f97316")
			.attr("stroke-width", 1.5)
			.attr("stroke-dasharray", "4,2");

		// Device data line
		const line = d3
			.line<number>()
			.x((_, i) => xScale(i))
			.y((d) => yScale(d))
			.curve(d3.curveMonotoneX);

		g.append("path")
			.datum(dataPoints)
			.attr("fill", "none")
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2)
			.attr("d", line);

		// Highlight excessive points
		let anomalyCount = 0;
		dataPoints.forEach((value, i) => {
			if (value > thresholdValue) {
				anomalyCount++;
				g.append("circle")
					.attr("cx", xScale(i))
					.attr("cy", yScale(value))
					.attr("r", 3)
					.attr("fill", "#f97316")
					.attr("stroke", "#ea580c")
					.attr("stroke-width", 1);
			}
		});

		g.append("text")
			.attr("x", width - 5)
			.attr("y", 12)
			.attr("text-anchor", "end")
			.attr("font-size", "9px")
			.attr("fill", "#f97316")
			.attr("font-weight", "600")
			.text(`Captured: ${anomalyCount}`);
	};

	return (
		<svg
			ref={svgRef}
			width={width}
			height={height}
			className="border border-gray-200 rounded"
		/>
	);
}
