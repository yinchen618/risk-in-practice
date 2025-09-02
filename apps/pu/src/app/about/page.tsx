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

const papers = {
	publications: [
		{
			key: "wseas_2022",
			category: "recent",
			authors: ["Ray-I Chang", "Yin-Chen Chen", "et al."],
			title: "Design and Implementation of an IoT Gateway for Zigbee and WiFi",
			venue: "WSEAS Transactions on Communications",
			year: 2022,
			type: "journal",
			pdf_url: "https://wseas.com/journals/articles.php?id=7038",
			scholar_url:
				"https://scholar.google.com.tw/citations?view_op=view_citation&hl=en&user=YiqWyHkAAAAJ&citation_for_view=YiqWyHkAAAAJ:SPgoriM2DtkC",
			citations: 1,
			citations_last_verified: "2025-08-10",
		},
		{
			key: "icact_2009_integrated",
			category: "foundational",
			authors: ["Ying-Chen Chen", "Chi-Cheng Chuang", "et al."],
			title: "Integrated Wireless Access Point Architecture for Wireless Sensor Networks",
			venue: "Proceedings of the 11th International Conference on Advanced Communication Technology (ICACT)",
			year: 2009,
			type: "conference",
			pdf_url: "https://dl.acm.org/doi/10.5555/1701955.1702094",
			scholar_url:
				"https://scholar.google.com.tw/citations?view_op=view_citation&hl=en&user=YiqWyHkAAAAJ&cstart=200&pagesize=100&sortby=pubdate&citation_for_view=YiqWyHkAAAAJ:_kc_bZDykSQC",
			citations: 15,
			citations_last_verified: "2025-08-10",
		},
		{
			key: "wasn_2009",
			category: "foundational",
			authors: ["Ying-Chen Chen", "Chi-Cheng Chuang", "Ray-I Chang"],
			title: "Wireless Sensor Network within an Open-Source Agent Framework",
			venue: "Workshop on Wireless, Ad Hoc, and Sensor Networks (WASN)",
			year: 2009,
			type: "conference",
			pdf_url: null,
			scholar_url: null,
			citations: null,
			citations_last_verified: null,
		},
		{
			key: "icact_2009_priority",
			category: "foundational",
			authors: [
				"Jia-Shian Lin",
				"Chi-Cheng Chuang",
				"Ray-I Chang",
				"Ying-Chen Chen",
				"et al.",
			],
			title: "A Priority-based Pattern Matching Location Algorithm for Wireless Sensor Networks",
			venue: "Proceedings of the 11th International Conference on Advanced Communication Technology (ICACT)",
			year: 2009,
			type: "conference",
			pdf_url: null,
			scholar_url: null,
			citations: null,
			citations_last_verified: null,
		},
	],
};

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

	const publications = papers.publications;
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
				{/* --- Hero Section --- */}
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
					{/* Updated Hero Statement */}
					<p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed mt-6">
						I run a 95-unit smart-residential testbed that generates
						high-frequency, real-world IoT time series at scale. My
						research focuses on advancing weakly supervised learning
						(PU/nnPU) to address covariate shift and label noise,
						directly aligned with
						<strong>
							{" "}
							Prof. Masashi Sugiyama's lab at UTokyo GSFS
						</strong>
						. My goal is to bridge theory and deployment, creating
						reliable ML systems for dynamic, human-centered
						environments.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500 mb-8">
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4" />
							<span>Taiwan</span>
						</div>
						<div className="flex items-center gap-2">
							<Building className="h-4 w-4" />
							<span>Target: UTokyo GSFS, Schedule B 2026</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span>TOEFL iBT planned (Sep/Oct 2025)</span>
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

				{/* --- [NEW] Motivation & About Section --- */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						Motivation & About
					</h2>
					<div className="max-w-4xl mx-auto">
						<Card className="border-slate-200">
							<CardContent className="">
								<p className="text-lg text-slate-700 leading-relaxed text-center">
									With 10+ years architecting enterprise IoT
									systems and independent research, I am
									seeking a PhD to tackle core problems in
									robust ML. I aim to bridge theory and
									deployment at scale by applying PU/nnPU to
									noisy, non-stationary data with UTokyo GSFS.
								</p>
							</CardContent>
						</Card>
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
											time series data (power,
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
											developing customized internal
											systems for domestic and
											international clients, including a
											portfolio platform for a
											Singapore-based investment firm. My
											primary business sectors include:
											<ul className="ml-4 mt-2 space-y-1">
												<li>
													• <strong>Finance:</strong>{" "}
													Investment platforms and
													financial management systems
												</li>
												<li>
													•{" "}
													<strong>Education:</strong>{" "}
													Campus and dormitory
													management platforms
												</li>
												<li>
													•{" "}
													<strong>
														Religious organizations:
													</strong>{" "}
													Sacrificial activities and
													accounting management
													systems
												</li>
												<li>
													•{" "}
													<strong>
														Real estate:
													</strong>{" "}
													Property management and
													smart home (IoT) platforms
												</li>
											</ul>
										</li>
										<li>
											• <strong>Spearheaded</strong> the
											Aichi International Academy smart
											campus project in Nagoya, from
											initial architecture to final
											deployment. Key achievements
											included:
											<ul className="ml-4 mt-2 space-y-1">
												<li>
													• On-site presence in Japan
													from{" "}
													<strong>2017-2019</strong>
												</li>
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
													infrastructure
												</li>
												<li>• Official website</li>
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
											• <strong>2024/7–2025/6,</strong>
											<div className="bg-green-50 border border-green-200 rounded-lg p-3 ml-4 mb-2">
												<p className="text-sm text-green-800">
													<strong>
														Evaluations:
													</strong>{" "}
													mean <strong>4.70</strong>,
													median <strong>4.70</strong>
													, IQR{" "}
													<strong>4.653–4.804</strong>
													, <strong>5</strong>{" "}
													sections,{" "}
													<strong>215</strong>{" "}
													students
												</p>
											</div>
										</li>
										<li>
											• Since 2022: evaluations weighted
											mean <strong>4.66</strong>;{" "}
											<strong>12</strong> sections,{" "}
											<strong>545</strong> students.
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
										<li>
											• <strong>Awards:</strong>
											University-Level Excellent Course
											Design (2024, 2025).
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

				{/* --- Languages & Availability Section --- */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						Languages & Availability
					</h2>
					<div className="max-w-4xl mx-auto">
						<Card className="border-slate-200">
							<CardContent className="pt-6">
								<div className="text-center space-y-4">
									<p className="text-slate-700">
										<strong>Languages:</strong> Mandarin
										(native), English (fluent), Japanese
										(JLPT N2)
									</p>
									<p className="text-slate-700">
										Applying UTokyo GSFS PhD (Schedule B,
										2026). TOEFL iBT planned (Sep/Oct 2025).
									</p>
									<p className="text-slate-700">
										Open to remote/on-site meetings.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* --- Japanese Summary Section --- */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
						志望動機・研究概要（要約）
					</h2>
					<div className="max-w-4xl mx-auto">
						<Card className="border-slate-200">
							<CardContent className="pt-6">
								<p className="text-slate-700 leading-relaxed">
									弱教師あり学習（PU/nnPU）を用いて、ノイズや分布変動（covariate
									shift）が存在する実環境IoTデータに対する堅牢なリスク最小化に取り組みます。95戸のスマート住宅テストベッド（高頻度マルチモーダル時系列）を運用し、重要度重み付け（密度比推定）やシフト認識型の評価指標を実装しています。実データの制約を踏まえ、理論的仮定を損なわないデータガバナンスと再現性のある評価系を整備し、実装と理論の架橋に貢献します。東京大学GSFS（杉山研究室）の研究テーマと強く整合しており、共同研究の形で価値を提供できます。
								</p>
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
						<Button variant="outline" asChild>
							<Link
								href="https://github.com/yinchen618"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-4 w-4 mr-2" />
								GitHub
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link
								href="https://yinchen.tw"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Globe className="h-4 w-4 mr-2" />
								Website
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
