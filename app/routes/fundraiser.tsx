import { useState, useRef } from "react";

export function meta() {
	return [
		{ title: "Krispy Kreme Fundraiser - Wasaga Stars U8" },
		{
			name: "description",
			content: "Support Luka and the Wasaga Stars U8 team with Krispy Kreme donuts!",
		},
	];
}

// Product data for the fundraiser
const products = [
	{ name: "Original Glazed Dozen", price: 16 },
	{ name: "Assorted Dozen", price: 18 },
	{ name: "Specialty Dozen", price: 20 },
	{ name: "Mini Cruller 20-Pack", price: 15 },
	{ name: "Original Glazed Doughnut Holes (45ct)", price: 14 },
];

export default function Fundraiser() {
	const [quantities, setQuantities] = useState<Record<number, number>>(
		Object.fromEntries(products.map((_, i) => [i, 0]))
	);
	const [copySuccess, setCopySuccess] = useState(false);
	const orderTableRef = useRef<HTMLTableElement>(null);
	const printSectionRef = useRef<HTMLDivElement>(null);

	// Calculate total for a product
	const getProductTotal = (index: number) => {
		return quantities[index] * products[index].price;
	};

	// Calculate grand total
	const getGrandTotal = () => {
		return products.reduce((sum, _, i) => sum + getProductTotal(i), 0);
	};

	// Get total quantity
	const getTotalQuantity = () => {
		return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
	};

	// Handle quantity change
	const handleQuantityChange = (index: number, value: string) => {
		const qty = parseInt(value) || 0;
		setQuantities((prev) => ({ ...prev, [index]: Math.max(0, qty) }));
	};

	// Copy order to clipboard for spreadsheet
	const copyToClipboard = () => {
		const rows = products
			.map((p, i) => `${p.name}\t${quantities[i]}\t$${getProductTotal(i)}`)
			.join("\n");
		const total = `TOTAL\t${getTotalQuantity()}\t$${getGrandTotal()}`;
		const text = `Product\tQty\tTotal\n${rows}\n${total}`;

		navigator.clipboard.writeText(text).then(() => {
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		});
	};

	// Print order
	const handlePrint = () => {
		window.print();
	};

	// Download as image (using canvas)
	const handleDownloadImage = () => {
		// Simple approach: trigger print dialog which can be saved as PDF
		window.print();
	};

	return (
		<div style={styles.container}>
			{/* Print styles */}
			<style>{`
				@media print {
					body * {
						visibility: hidden;
					}
					.print-section, .print-section * {
						visibility: visible;
					}
					.print-section {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
					}
					.no-print {
						display: none !important;
					}
				}
			`}</style>

			<div ref={printSectionRef} className="print-section" style={styles.card}>
				{/* Header with team info */}
				<div style={styles.header}>
					<div style={styles.headerContent}>
						{/* Placeholder image - swap src to child's real photo */}
						<img
							src="https://placehold.co/120x120/e11d48/ffffff?text=LUKA"
							alt="Luka - Wasaga Stars U8"
							style={styles.playerPhoto}
						/>
						<div style={styles.headerText}>
							<h1 style={styles.title}>🍩 Krispy Kreme Fundraiser 🍩</h1>
							<h2 style={styles.subtitle}>Wasaga Stars U8 Soccer Team</h2>
							<p style={styles.playerName}>
								Support <strong>Luka</strong> and help our team reach our goals!
							</p>
						</div>
					</div>
				</div>

				{/* Order Form */}
				<div style={styles.orderSection}>
					<h3 style={styles.sectionTitle}>Place Your Order</h3>
					<table ref={orderTableRef} style={styles.table}>
						<thead>
							<tr>
								<th style={styles.th}>Product</th>
								<th style={styles.thCenter}>Price</th>
								<th style={styles.thCenter}>Qty</th>
								<th style={styles.thRight}>Total</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product, index) => (
								<tr key={index} style={styles.tr}>
									<td style={styles.td}>{product.name}</td>
									<td style={styles.tdCenter}>${product.price}</td>
									<td style={styles.tdCenter}>
										<input
											type="number"
											min="0"
											value={quantities[index]}
											onChange={(e) =>
												handleQuantityChange(index, e.target.value)
											}
											style={styles.qtyInput}
											className="no-print"
										/>
										<span
											className="print-only"
											style={{ display: "none" }}
										>
											{quantities[index]}
										</span>
									</td>
									<td style={styles.tdRight}>${getProductTotal(index)}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr style={styles.totalRow}>
								<td style={styles.totalLabel} colSpan={2}>
									<strong>GRAND TOTAL</strong>
								</td>
								<td style={styles.totalQty}>
									<strong>{getTotalQuantity()} items</strong>
								</td>
								<td style={styles.totalAmount}>
									<strong>${getGrandTotal()}</strong>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				{/* Payment Info */}
				<div style={styles.paymentSection}>
					<h3 style={styles.sectionTitle}>Payment Information</h3>
					<div style={styles.paymentInfo}>
						<p>
							<strong>E-Transfer to:</strong>{" "}
							<span style={styles.email}>ann.lang0811@gmail.com</span>
						</p>
						<p>
							<strong>Contact:</strong> Daniela Torelli
						</p>
						<p style={styles.note}>
							Please include your name and &ldquo;Luka - Krispy Kreme&rdquo; in the
							e-transfer message.
						</p>
					</div>
				</div>

				{/* Pickup Info */}
				<div style={styles.pickupSection}>
					<h3 style={styles.sectionTitle}>Pickup Details</h3>
					<p>Pickup date and location will be communicated after orders are placed.</p>
					<p style={styles.thankYou}>
						Thank you for supporting the <strong>Wasaga Stars U8</strong> team! 🌟⚽
					</p>
				</div>
			</div>

			{/* Action Buttons - No Print */}
			<div className="no-print" style={styles.actions}>
				<button onClick={copyToClipboard} style={styles.button}>
					{copySuccess ? "✓ Copied!" : "📋 Copy for Spreadsheet"}
				</button>
				<button onClick={handlePrint} style={styles.button}>
					🖨️ Print Order
				</button>
				<button onClick={handleDownloadImage} style={styles.buttonSecondary}>
					📥 Download / Save as PDF
				</button>
			</div>

			{/* Copy Success Notification */}
			{copySuccess && (
				<div style={styles.notification}>
					Order copied to clipboard! Paste into your spreadsheet.
				</div>
			)}
		</div>
	);
}

// Inline styles for the fundraiser page
const styles: Record<string, React.CSSProperties> = {
	container: {
		fontFamily:
			"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
		maxWidth: "700px",
		margin: "0 auto",
		padding: "20px",
		backgroundColor: "#f8f9fa",
		minHeight: "100vh",
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: "16px",
		boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
		overflow: "hidden",
	},
	header: {
		background: "linear-gradient(135deg, #00a651 0%, #007a3d 100%)",
		color: "white",
		padding: "30px 20px",
		textAlign: "center" as const,
	},
	headerContent: {
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		gap: "15px",
	},
	playerPhoto: {
		width: "120px",
		height: "120px",
		borderRadius: "50%",
		border: "4px solid white",
		objectFit: "cover" as const,
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
	},
	headerText: {
		textAlign: "center" as const,
	},
	title: {
		fontSize: "28px",
		fontWeight: "bold",
		margin: "0 0 8px 0",
		textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
	},
	subtitle: {
		fontSize: "20px",
		fontWeight: "600",
		margin: "0 0 8px 0",
		opacity: 0.95,
	},
	playerName: {
		fontSize: "16px",
		margin: "0",
		opacity: 0.9,
	},
	orderSection: {
		padding: "25px 20px",
	},
	sectionTitle: {
		fontSize: "18px",
		fontWeight: "600",
		color: "#333",
		marginBottom: "15px",
		paddingBottom: "8px",
		borderBottom: "2px solid #00a651",
	},
	table: {
		width: "100%",
		borderCollapse: "collapse" as const,
		fontSize: "15px",
	},
	th: {
		textAlign: "left" as const,
		padding: "12px 8px",
		backgroundColor: "#f1f3f5",
		borderBottom: "2px solid #dee2e6",
		fontWeight: "600",
		color: "#495057",
	},
	thCenter: {
		textAlign: "center" as const,
		padding: "12px 8px",
		backgroundColor: "#f1f3f5",
		borderBottom: "2px solid #dee2e6",
		fontWeight: "600",
		color: "#495057",
	},
	thRight: {
		textAlign: "right" as const,
		padding: "12px 8px",
		backgroundColor: "#f1f3f5",
		borderBottom: "2px solid #dee2e6",
		fontWeight: "600",
		color: "#495057",
	},
	tr: {
		borderBottom: "1px solid #e9ecef",
	},
	td: {
		padding: "12px 8px",
		color: "#333",
	},
	tdCenter: {
		padding: "12px 8px",
		textAlign: "center" as const,
		color: "#333",
	},
	tdRight: {
		padding: "12px 8px",
		textAlign: "right" as const,
		color: "#333",
		fontWeight: "500",
	},
	qtyInput: {
		width: "60px",
		padding: "8px",
		fontSize: "14px",
		textAlign: "center" as const,
		border: "1px solid #ced4da",
		borderRadius: "6px",
		outline: "none",
	},
	totalRow: {
		backgroundColor: "#00a651",
		color: "white",
	},
	totalLabel: {
		padding: "14px 8px",
		fontSize: "16px",
	},
	totalQty: {
		padding: "14px 8px",
		textAlign: "center" as const,
		fontSize: "16px",
	},
	totalAmount: {
		padding: "14px 8px",
		textAlign: "right" as const,
		fontSize: "18px",
	},
	paymentSection: {
		padding: "25px 20px",
		backgroundColor: "#f8f9fa",
	},
	paymentInfo: {
		backgroundColor: "#fff3cd",
		border: "1px solid #ffc107",
		borderRadius: "8px",
		padding: "15px",
	},
	email: {
		color: "#0066cc",
		fontWeight: "500",
	},
	note: {
		fontSize: "14px",
		color: "#666",
		marginTop: "10px",
		fontStyle: "italic",
	},
	pickupSection: {
		padding: "25px 20px",
		textAlign: "center" as const,
		borderTop: "1px solid #e9ecef",
	},
	thankYou: {
		marginTop: "15px",
		fontSize: "16px",
		color: "#00a651",
	},
	actions: {
		display: "flex",
		flexWrap: "wrap" as const,
		gap: "10px",
		justifyContent: "center",
		padding: "20px",
	},
	button: {
		padding: "12px 24px",
		fontSize: "15px",
		fontWeight: "600",
		color: "white",
		backgroundColor: "#00a651",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "background-color 0.2s",
	},
	buttonSecondary: {
		padding: "12px 24px",
		fontSize: "15px",
		fontWeight: "600",
		color: "#333",
		backgroundColor: "#e9ecef",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "background-color 0.2s",
	},
	notification: {
		position: "fixed" as const,
		bottom: "20px",
		left: "50%",
		transform: "translateX(-50%)",
		backgroundColor: "#28a745",
		color: "white",
		padding: "12px 24px",
		borderRadius: "8px",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
		zIndex: 1000,
		animation: "fadeIn 0.3s ease-out",
	},
};
