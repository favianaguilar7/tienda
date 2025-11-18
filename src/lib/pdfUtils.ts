import PDFDocument from "pdfkit";

export async function generatePdfBuffer(
    buildContent: (doc: PDFKit.PDFDocument) => void
): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    return await new Promise((resolve, reject) => {
        doc.on("data", (chunk) => {
            chunks.push(chunk as Buffer);
        });

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", (err) => {
            reject(err);
        });

        buildContent(doc);
        doc.end();
    });
}