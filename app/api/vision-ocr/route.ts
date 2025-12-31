import { NextRequest, NextResponse } from 'next/server';
import { genkit } from 'genkit';
import { googleAI } from "@genkit-ai/googleai";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Check file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Please upload PNG, JPG, or PDF.' }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');

        // Use Gemini Vision for OCR
        const ai = genkit({
            plugins: [googleAI()],
        });

        const prompt = `Analyze this resume image and extract ALL text with their exact visual positions.

Return a JSON object with this EXACT structure:
{
  "pageWidth": 1000,
  "pageHeight": 1100,
  "textBlocks": [
    {
      "text": "The actual text content",
      "x": 40,
      "y": 30,
      "width": 300,
      "height": 40,
      "fontSize": 28,
      "fontWeight": "bold",
      "textAlign": "center"
    }
  ]
}

CRITICAL POSITIONING RULES:
- Use a coordinate system of 1000x1100 points (wide format for full resume)
- x=0 is the LEFT edge, y=0 is the TOP edge
- Most resume text starts around x=50-80 (left margin)
- Name/headers centered should have x around 300-500 depending on text length
- Dates on the right side should have x around 750-900
- Keep text blocks within bounds (x + width < 1000)

FONT SIZE GUIDELINES:
- Name/Title: 24-32pt
- Section headers (EDUCATION, EXPERIENCE): 14-18pt bold
- Subheaders (Job titles, degrees): 12-14pt bold  
- Body text: 10-12pt normal
- Contact info: 10-11pt

TEXT ALIGNMENT:
- textAlign: "left", "center", or "right"
- Names are often centered
- Body text is usually left-aligned
- Dates are often right-aligned

Extract EVERY line of text as a separate block. Preserve exact layout positioning.
Return ONLY valid JSON, no markdown or explanation.`;

        // Use gemini-1.5-flash for vision tasks (supports images)
        const modelName = 'gemini-2.5-flash';
        console.log('Using model:', modelName);

        const response = await ai.generate({
            model: googleAI.model(modelName),
            prompt: [
                { text: prompt },
                {
                    media: {
                        contentType: file.type as any,
                        url: `data:${file.type};base64,${base64}`,
                    },
                },
            ],
        });

        // Extract text from response
        const anyResponse = response as any;
        let resultText = '';

        console.log('Response structure:', JSON.stringify(Object.keys(anyResponse)));

        if (anyResponse.message && anyResponse.message.content && Array.isArray(anyResponse.message.content)) {
            for (const part of anyResponse.message.content) {
                if (part.text) {
                    resultText += part.text;
                }
            }
        } else if (anyResponse.text) {
            resultText = anyResponse.text;
        } else if (typeof anyResponse === 'string') {
            resultText = anyResponse;
        }

        console.log('Result text length:', resultText.length);
        console.log('Result text preview:', resultText.substring(0, 200));

        if (!resultText) {
            console.error('Empty response from AI');
            return NextResponse.json(
                { error: 'No text extracted from image. Please try a clearer image.' },
                { status: 500 }
            );
        }

        // Parse JSON from response (handle markdown code blocks)
        let jsonStr = resultText;
        if (resultText.includes('```json')) {
            jsonStr = resultText.split('```json')[1].split('```')[0].trim();
        } else if (resultText.includes('```')) {
            jsonStr = resultText.split('```')[1].split('```')[0].trim();
        }

        try {
            const ocrResult = JSON.parse(jsonStr);
            return NextResponse.json({
                success: true,
                data: ocrResult,
            });
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('JSON string:', jsonStr.substring(0, 500));
            return NextResponse.json(
                { error: 'Failed to parse OCR result. Please try again.' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Vision OCR Error:', error);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);

        // Return more specific error message
        const errorMessage = error?.message || 'Unknown error occurred';
        return NextResponse.json(
            { error: `Failed to process image: ${errorMessage}` },
            { status: 500 }
        );
    }
}

