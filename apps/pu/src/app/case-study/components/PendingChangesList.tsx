import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export interface PendingDiffItem {
	label: string;
	from: string;
	to: string;
}

interface Props {
	pendingDiffs: PendingDiffItem[];
	onSave: () => Promise<void> | void;
	className?: string;
	theme?: "yellow" | "orange";
	isSaving?: boolean;
}

export function PendingChangesList({
	pendingDiffs,
	onSave,
	className = "",
	theme = "yellow",
	isSaving = false,
}: Props) {
	if (!pendingDiffs || pendingDiffs.length === 0) {
		return null;
	}

	const bg =
		theme === "orange"
			? "bg-orange-50 border-orange-200"
			: "bg-yellow-50 border-yellow-200";
	const titleColor =
		theme === "orange" ? "text-orange-800" : "text-yellow-800";
	const buttonClass =
		theme === "orange"
			? "mt-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded"
			: "mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded";
	const iconColor =
		theme === "orange" ? "text-orange-600" : "text-yellow-600";

	return (
		<div className={`w-full max-w-md ${className}`}>
			<Alert className={`${bg}`}>
				<Info className={`h-4 w-4 ${iconColor}`} />
				<AlertDescription>
					<div className="space-y-2">
						<div className={`font-semibold ${titleColor}`}>
							Pending Changes ({pendingDiffs.length} items):
						</div>
						{pendingDiffs.map((diff, idx) => (
							<div key={idx} className="text-sm">
								<span className="font-medium">
									{diff.label}:
								</span>{" "}
								<span className="text-red-600">
									{diff.from}
								</span>{" "}
								→{" "}
								<span className="text-green-600">
									{diff.to}
								</span>
							</div>
						))}
						<Button
							onClick={onSave}
							size="sm"
							className={buttonClass}
							disabled={isSaving}
						>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</AlertDescription>
			</Alert>
		</div>
	);
}
