"use client";

import DataSplitStrategy from "@/app/case-study/components/implementation2/DataSplitStrategy";
import ImplementationIntro from "@/app/case-study/components/implementation2/ImplementationIntro";
import ModelEvaluation from "@/app/case-study/components/implementation2/ModelEvaluation";
import ModelTraining from "@/app/case-study/components/implementation2/ModelTraining";
import SinglePhaseThreeWire from "@/app/case-study/components/implementation2/SinglePhaseThreeWire";
import TechStack from "@/app/case-study/components/implementation2/TechStack";
// Assuming these are your existing, detailed content components
// (Their internal text content should also be translated to English)
import DataPreprocessingRevised from "./implementation2/DataPreprocessing"; // Using the refined version

export default function SystemNarrativeEnglish() {
	return (
		<div className="space-y-16">
			{/* Opening Introduction */}
			<ImplementationIntro />

			{/* =============================================================== */}
			{/* Act I: The Data Challenge                                     */}
			{/* =============================================================== */}
			<section id="data-challenge" className="scroll-mt-24">
				<div className="mb-6">
					<h2 className="text-3xl font-bold text-gray-800">
						Act I: The Data Challenge
					</h2>
					<p className="text-lg text-gray-500 mt-2">
						How can I distill clean, ML-ready features from noisy,
						real-world signals?
					</p>
				</div>
				<div className="space-y-8">
					{/* This component perfectly answers the question of handling raw data */}
					<SinglePhaseThreeWire />
				</div>
			</section>

			{/* =============================================================== */}
			{/* Act II: The Learning Challenge                                */}
			{/* =============================================================== */}
			<section id="learning-challenge" className="scroll-mt-24">
				<div className="mb-6">
					<h2 className="text-3xl font-bold text-gray-800">
						Act II: The Learning Challenge
					</h2>
					<p className="text-lg text-gray-500 mt-2">
						How to build a robust model that understands temporal
						patterns from imperfectly labeled data?
					</p>
				</div>
				<div className="space-y-8">
					{/* The complete machine learning pipeline */}
					<DataPreprocessingRevised />{" "}
					{/* High-level overview of the 4 steps */}
					<DataSplitStrategy />{" "}
					{/* Deep dive into the critical splitting strategy */}
					<ModelTraining />{" "}
					{/* Explains the model architecture and nnPU training */}
					<ModelEvaluation />{" "}
					{/* Details the correct way to evaluate PU models */}
				</div>
			</section>

			{/* =============================================================== */}
			{/* Act III: The Architectural Challenge                          */}
			{/* =============================================================== */}
			<section id="architecture-challenge" className="scroll-mt-24">
				<div className="mb-6">
					<h2 className="text-3xl font-bold text-gray-800">
						Act III: The Architectural Challenge
					</h2>
					<p className="text-lg text-gray-500 mt-2">
						How to integrate all components into an operational,
						reproducible end-to-end system?
					</p>
				</div>
				<div className="space-y-8">
					{/* This component perfectly concludes the story by showing the full system */}
					<TechStack />
				</div>
			</section>
		</div>
	);
}
