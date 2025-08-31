"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Brain,
	Building,
	Calendar,
	Code2,
	Download,
	Github,
	Globe,
	GraduationCap,
	Mail,
	MapPin,
	Server,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
	// 1. 先替換掉原本的 PublicationsList 元件
	function PublicationsList({ items }: { items: any[] }) {
		// Now this component just receives items and renders them.
		return (
			<div className="space-y-6">
				{items.map((p) => {
					const verified =
						typeof p.citations === "number" &&
						p.citations_last_verified;
					return (
						<div
							key={p.key}
							className="border-l-4 border-slate-600 pl-4"
						>
							{/* [MODIFIED] Added authors list for a formal citation format */}
							<p className="text-slate-700 text-[0.95em]">
								{p.authors.join(", ")}. ({p.year}).
							</p>
							<h4 className="font-semibold text-slate-800 leading-snug">
								{p.title}
							</h4>
							<div className="flex items-center gap-2 mt-1">
								<p className="text-slate-600 italic text-sm">
									{p.venue}.
								</p>
								{/* [NEW] Publication Type Badge */}
								<span
									className={`px-2 py-0.5 rounded-full text-xs font-medium ${
										p.type === "journal"
											? "bg-blue-100 text-blue-800 border border-blue-200"
											: "bg-green-100 text-green-800 border border-green-200"
									}`}
								>
									{p.type === "journal"
										? "Journal"
										: "Conference"}
								</span>
							</div>
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-2">
								{p.pdf_url && (
									<a
										href={p.pdf_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-700 hover:underline"
									>
										[PDF]
									</a>
								)}
								{p.scholar_url && (
									<a
										href={p.scholar_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-700 hover:underline"
									>
										[Google Scholar]
									</a>
								)}
								{p.citations !== null && (
									<span
										className={`px-2 py-0.5 rounded ${
											verified
												? "bg-blue-100 text-blue-800"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										Cited by:{" "}
										{verified ? p.citations : "N/A"}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		);
	}
	// 2. 在您的 AboutPage 元件內部，return 語句之前，加入這段數據處理邏輯
	const [publications, setPublications] = React.useState<any[]>([]);
	React.useEffect(() => {
		fetch("/data/publications.json")
			.then((r) => r.json())
			.then((j) => setPublications(j.publications || []))
			.catch(() => setPublications([]));
	}, []);

	const recentPubs = publications.filter((p) => p.category === "recent");
	const foundationalPubs = publications.filter(
		(p) => p.category === "foundational",
	);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
			id="top"
		>
			<div className="container mx-auto px-4 py-12 md:py-16">
				{/* --- [MODIFIED] Hero Section: Changed to a Statement of Purpose --- */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white mb-8">
						<GraduationCap className="h-12 w-12" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-slate-800">
						Yin‑Chen Chen
					</h1>
					<h2 className="mt-2 text-xl md:text-2xl font-semibold text-slate-600">
						Prospective PhD Student – Machine Learning & IoT Systems
					</h2>
					{/* --- [NEW] Statement of Purpose Paragraph --- */}
					<p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed mt-6">
						With over a decade of experience architecting
						enterprise-level IoT systems and conducting independent
						research, I am now seeking to pursue a PhD to address
						fundamental challenges in machine learning. My focus
						lies in applying weakly-supervised methods, like PU
						learning, to noisy, non-stationary real-world data. My
						long-term goal is to bridge the gap between robust
						theoretical models and their practical, large-scale
						implementation—a vision I believe aligns strongly with
						the work of{" "}
						<strong>
							Prof. Masashi Sugiyama's lab at the University of
							Tokyo
						</strong>
						.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500 mb-8">
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4" />
							<span>Taiwan</span>
						</div>
						<div className="flex items-center gap-2">
							<Building className="h-4 w-4" />
							<span>
								Target: Dept. of Complexity Science and
								Engineering, GSFS, UTokyo
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span>
								Seeking PhD Admission for 2026 Schedule B
							</span>
						</div>
					</div>
					<div className="flex justify-center gap-4">
						<Button
							asChild
							className="bg-slate-800 hover:bg-slate-700"
						>
							<Link
								href="/CV_YinChen_Chen_U-Tokyo_PhD_2026.pdf"
								target="_blank"
							>
								<Download className="h-4 w-4 mr-2" />
								Download Full CV (PDF)
							</Link>
						</Button>
					</div>
				</div>

				{/* --- Academic & Professional Trajectory Section --- */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						Academic & Professional Trajectory
					</h2>
					<div className="max-w-4xl mx-auto space-y-8">
						{/* --- [ENHANCED] Research Experience --- */}
						<Card className="border-slate-200">
							<CardHeader>
								<CardTitle className="text-xl text-slate-800 flex items-center gap-2">
									<Brain className="h-5 w-5 text-slate-500" />
									Independent Research
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										Lead Researcher & Architect, Smart
										Residential Testbed
									</h3>
									<p className="text-sm text-slate-500">
										2015 - Present
									</p>
									<p className="text-slate-600 mt-2 italic text-sm">
										A self-directed research initiative to
										create a living laboratory for studying
										human dynamics and robust machine
										learning with real-world, high-frequency
										data.
									</p>
									<ul className="text-slate-600 mt-2 space-y-1">
										<li>
											• <strong>Architected</strong> and{" "}
											<strong>deployed</strong> a 95-unit
											smart residential IoT testbed from
											the ground up.
										</li>
										<li>
											• <strong>Developed</strong> a full
											data pipeline for collecting,
											processing, and analyzing multimodal
											time-series data (power,
											environment, etc.).
										</li>
										<li>
											• <strong>Applied</strong>{" "}
											weakly-supervised learning
											(uPU/nnPU) to validate theoretical
											models against non-stationary,
											real-world data streams.
										</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						{/* --- [ENHANCED] Professional Experience --- */}
						<Card className="border-slate-200">
							<CardHeader>
								<CardTitle className="text-xl text-slate-800 flex items-center gap-2">
									<Globe className="h-5 w-5 text-slate-500" />
									Professional Experience
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										Founder & General Manager
									</h3>
									<p className="text-slate-600">
										Infowin Technology Co., Ltd., Taiwan
									</p>
									<p className="text-sm text-slate-500">
										2015 - Present
									</p>
									<ul className="text-slate-600 mt-2 space-y-1">
										<li>
											• As founder, I{" "}
											<strong>directed</strong> all
											technical and business operations,
											leading the design of bespoke
											enterprise systems for clients in
											finance, education, religious
											organizations, and real estate,
											including a portfolio platform for a
											Singapore-based investment firm.
										</li>
										<li>
											• <strong>Spearheaded</strong> the
											Aichi International Academy smart
											campus project in Nagoya, from
											initial architecture to final
											deployment. This required a
											significant on-site presence in
											Japan from{" "}
											<strong>2017-2019</strong> to manage
											implementation, client
											collaboration, and the digital
											transformation of campus operations
											using IoT sensors. Key achievements
											included:
											<ul className="ml-4 mt-2 space-y-1">
												<li>
													• Built comprehensive
													internal management systems
													for campus operations
												</li>
												<li>
													• Developed and deployed
													facial recognition systems
													for automated attendance
													tracking and temperature
													monitoring
												</li>
												<li>
													• Integrated IoT sensor
													networks throughout the
													dormitory infrastructure
												</li>
											</ul>
										</li>
									</ul>
								</div>
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										Software Engineer
									</h3>
									<p className="text-slate-600">
										IBM Taiwan, Taipei
									</p>
									<p className="text-sm text-slate-500">
										2011 - 2014
									</p>
									<ul className="text-slate-600 mt-2 space-y-1">
										<li>
											• Developed low-level UEFI firmware
											for IBM System x servers, focusing
											on mission-critical RAS
											(Reliability, Availability,
											Serviceability) features.
										</li>
										<li>
											• As part of a global solution team,
											performed root-cause analysis for
											critical system failures in
											high-stakes data center
											environments.
										</li>
									</ul>
								</div>
							</CardContent>
						</Card>
						{/* --- [ENHANCED] Teaching Experience Card with Syllabi Links --- */}
						<Card className="border-slate-200">
							<CardHeader>
								<CardTitle className="text-xl text-slate-800 flex items-center gap-2">
									<GraduationCap className="h-5 w-5 text-slate-500" />
									Teaching Experience
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										Part-time Lecturer (AI & Programming)
									</h3>
									<p className="text-slate-600">
										Chung Yuan Christian University, Dept.
										of Commercial Design
									</p>
									<p className="text-sm text-slate-500">
										2022 – Present
									</p>
									<ul className="text-slate-600 mt-2 space-y-1">
										<li>
											• Designed and taught foundational
											AI and computing courses for
											non-STEM students.
										</li>
										<li>
											• Achieved consistent student
											evaluation scores averaging 4.66/5.0
											across 12 courses since 2022, and
											was consecutively selected for the
											University-Level Excellent Course
											Design Award in 2024 and 2025.
										</li>
										<li>
											• Transformed the course into a live
											demonstration of applied AI by
											developing and deploying custom
											systems, including a facial
											recognition attendance tracker and a
											conversational bot for grade
											management.
										</li>
										{/* --- [NEW] Syllabi Links --- */}
										{/* --- [FINAL] Syllabi Links with Nested List & Badges --- */}
										<li className="pt-1">
											<div className="flex">
												<span className="mr-2">•</span>
												<div>
													<span className="font-semibold">
														Official Syllabi:
													</span>
													<ul className="list-disc pl-5 mt-1 space-y-2">
														<li>
															<a
																href="https://cmap.cycu.edu.tw:8443/Syllabus/CoursePreview.html?yearTerm=1141&opCode=CD000A&locale=en_US"
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-700 hover:underline"
															>
																Introduction to
																Natural Science
																and AI
															</a>
															<Badge
																variant="outline"
																className="ml-2 border-green-600 bg-green-50 text-green-700"
															>
																Required
															</Badge>
														</li>
														<li>
															<a
																href="https://cmap.cycu.edu.tw:8443/Syllabus/CoursePreview.html?yearTerm=1132&opCode=CD888A&locale=en_US"
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-700 hover:underline"
															>
																Computational
																Thinking and
																Programming
															</a>
															<Badge
																variant="outline"
																className="ml-2 border-green-600 bg-green-50 text-green-700"
															>
																Required
															</Badge>
														</li>
														<li>
															<a
																href="https://cmap.cycu.edu.tw:8443/Syllabus/CoursePreview.html?yearTerm=1131&opCode=CD637D&locale=en_US"
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-700 hover:underline"
															>
																Introduction of
																Computer
																Programming
															</a>
															<Badge
																variant="outline"
																className="ml-2 border-sky-600 bg-sky-50 text-sky-700"
															>
																Elective
															</Badge>
														</li>
													</ul>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</CardContent>
						</Card>
						{/* --- [ENHANCED] Education Section --- */}
						<Card className="border-slate-200">
							<CardHeader>
								<CardTitle className="text-xl text-slate-800 flex items-center gap-2">
									<GraduationCap className="h-5 w-5 text-slate-500" />
									Education & Academic Background
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										M.S., Engineering Science and Ocean
										Engineering
									</h3>
									<p className="text-slate-600">
										National Taiwan University | 2009
									</p>
									<p className="text-slate-600 mt-1 italic text-sm">
										Laboratory: Information and Network
										Application Lab (Advisor: Prof. Ray-I
										Chang)
									</p>
									<p className="text-slate-600 mt-1 italic text-sm">
										Thesis: Integration of Wireless Access
										Point and Sensor Networks
									</p>
								</div>
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										B.S., Computer Science and Engineering
									</h3>
									<p className="text-slate-600">
										Tatung University | 2006
									</p>
								</div>
								<div className="border-l-4 border-slate-600 pl-4">
									<h3 className="font-semibold text-slate-800">
										Prior PhD Program Admission (without
										examination)
									</h3>
									<p className="text-slate-600">
										National Taiwan University | 2009
									</p>
									<p className="text-slate-600 mt-1 italic text-sm">
										I withdrew to fulfill national service
										and gain industry experience, a decision
										that provided the practical foundation
										for my current research interests.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* --- [MODIFIED] Publications Section with Thematic Categories --- */}
				<div className="mb-16" id="publications">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						Key Research Publications
					</h2>
					<div className="max-w-4xl mx-auto">
						<Card className="border-slate-200">
							<CardHeader>
								<p className="text-slate-600 italic text-sm">
									Note: Earlier publications were published
									under the name "Ying‑Chen Chen".
								</p>
							</CardHeader>
							<CardContent className="space-y-8">
								{/* Category 1: Recent Work */}
								{recentPubs.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-300 pb-2">
											Recent Work in Internet of Things
											(IoT)
										</h3>
										<PublicationsList items={recentPubs} />
									</div>
								)}

								{/* Category 2: Foundational Work */}
								{foundationalPubs.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-300 pb-2">
											Foundational Work in Wireless Sensor
											Networks (WSN)
										</h3>
										<PublicationsList
											items={foundationalPubs}
										/>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>

				{/* --- Technical Skills Section --- */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						Technical Expertise
					</h2>
					<div className="max-w-4xl mx-auto">
						<Card className="border-slate-200">
							<CardContent className="pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									<div>
										<h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
											<Brain className="h-4 w-4" />
											Machine Learning
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge variant="secondary">
												PU Learning
											</Badge>
											<Badge variant="secondary">
												Time-Series Analysis
											</Badge>{" "}
											{/* <-- New */}
											<Badge variant="secondary">
												Domain Adaptation
											</Badge>{" "}
											{/* <-- New */}
											<Badge variant="secondary">
												PyTorch
											</Badge>
											<Badge variant="secondary">
												Scikit-learn
											</Badge>
											<Badge variant="secondary">
												Pandas
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
											<Code2 className="h-4 w-4" />
											Software Engineering
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge variant="secondary">
												Python
											</Badge>
											<Badge variant="secondary">
												FastAPI
											</Badge>
											<Badge variant="secondary">
												Next.js
											</Badge>
											<Badge variant="secondary">
												TypeScript
											</Badge>
											<Badge variant="secondary">
												PostgreSQL
											</Badge>
											<Badge variant="secondary">
												C/C++
											</Badge>
										</div>
									</div>
									<div>
										<h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
											<Server className="h-4 w-4" />
											Systems & Infrastructure
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge variant="secondary">
												IoT Architecture
											</Badge>
											<Badge variant="secondary">
												Docker
											</Badge>
											<Badge variant="secondary">
												AWS
											</Badge>
											<Badge variant="secondary">
												On-Premise Servers
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* --- [MODIFIED] Awards & Honors, reverse chronological --- */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						Awards & Honors
					</h2>
					<div className="max-w-4xl mx-auto">
						<Card className="border-slate-200">
							<CardContent className="pt-6">
								<ul className="space-y-2">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
										<p>
											University-Level Excellent Course
											Design Award (2024, 2025)
										</p>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
										<p>
											Third Prize, 4th ARM Code-O-Rama
											Embedded Programming Contest (2008)
										</p>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
										<p>
											Champion, 3rd ARM Code-O-Rama
											Embedded Programming Contest (2007)
										</p>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
										<p>
											Champion, 7th National Taiwan
											University Innovation Competition
											(2007)
										</p>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* --- Contact Section --- */}
				<div className="text-center mt-16">
					<h2 className="text-3xl font-bold mb-6 text-slate-800">
						Contact & Links
					</h2>
					<div className="flex justify-center flex-wrap gap-4">
						<Button variant="outline" asChild>
							<Link href="mailto:yinchen618@gmail.com">
								<Mail className="h-4 w-4 mr-2" />
								Email
							</Link>
						</Button>
						{/* <Button variant="outline" asChild>
							<Link
								href="https://linkedin.com/in/your-profile" // Remember to fill this in
								target="_blank"
								rel="noopener noreferrer"
							>
								<Linkedin className="h-4 w-4 mr-2" />
								LinkedIn
							</Link>
						</Button> */}
						<Button variant="outline" asChild>
							<Link
								href="https://github.com/yinchen618/pu-in-practice" // Remember to fill this in
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-4 w-4 mr-2" />
								GitHub
							</Link>
						</Button>
					</div>
					<div className="mt-6 text-sm text-slate-500">
						Languages: Mandarin Chinese (Native), English (Fluent),
						Japanese (Intermediate, JLPT N2)
					</div>
				</div>
			</div>
		</div>
	);
}
