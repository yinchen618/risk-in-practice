"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { caseStudyV2API } from "../api/client";
import type { FilteringParameters } from "../types";

export function useExperimentRuns() {
	return useQuery({
		queryKey: ["experiment-runs"],
		queryFn: () => caseStudyV2API.getExperimentRuns(),
		staleTime: 30000, // 30 seconds
	});
}

export function useExperimentRun(id?: string) {
	return useQuery({
		queryKey: ["experiment-run", id],
		queryFn: () =>
			id ? caseStudyV2API.getExperimentRun(id) : Promise.resolve(null),
		enabled: !!id,
		staleTime: 10000, // 10 seconds
		refetchInterval: (query) => {
			// Auto-refresh if experiment is in progress
			if (query.state.data?.status === "CONFIGURING") {
				return 5000; // 5 seconds
			}
			return false;
		},
	});
}

export function useCreateExperimentRun() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			name: string;
			description?: string;
			filtering_parameters: FilteringParameters;
		}) => caseStudyV2API.createExperimentRun(data),
		onSuccess: () => {
			// Invalidate experiment runs list
			queryClient.invalidateQueries({ queryKey: ["experiment-runs"] });
		},
	});
}

export function useDeleteExperimentRun() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => caseStudyV2API.deleteExperimentRun(id),
		onSuccess: () => {
			// Invalidate experiment runs list and clear individual experiment cache
			queryClient.invalidateQueries({ queryKey: ["experiment-runs"] });
			queryClient.removeQueries({ queryKey: ["experiment-run"] });
		},
	});
}
