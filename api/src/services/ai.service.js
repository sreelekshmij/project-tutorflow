const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateSessionPlan = async ({
    subject,
    currentLevel,
    learningGoals,
    weakAreas,
    topic,
}) => {
    const prompt = `
You are an experienced one-to-one tutoring assistant.

Create a practical lesson plan for a tutoring session.

Student Information:
Subject: ${subject}
Current Level: ${currentLevel || "Not specified"}
Learning Goals: ${learningGoals || "Not specified"}
Weak Areas: ${weakAreas || "Not specified"}

Session Topic:
${topic}

Create:
1. Three clear learning objectives.
2. A four-point lesson outline.
3. Three practice questions appropriate for the student's level.

Return ONLY valid JSON in exactly this structure:

{
  "objectives": [
    "objective 1",
    "objective 2",
    "objective 3"
  ],
  "lessonOutline": [
    "step 1",
    "step 2",
    "step 3",
    "step 4"
  ],
  "practiceQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}
`;

    const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input: prompt,
    });

    const result = response.output_text;

    try {
        return JSON.parse(result);
    } catch (error) {
        throw new Error("AI returned an invalid lesson plan.");
    }
};

const generateSessionDebrief = async ({
    subject,
    currentLevel,
    learningGoals,
    weakAreas,
    topic,
    notes,
}) => {
    const prompt = `
You are an experienced one-to-one tutoring assistant.

Analyze the following completed tutoring session.

Student Information:
Subject: ${subject}
Current Level: ${currentLevel || "Not specified"}
Learning Goals: ${learningGoals || "Not specified"}
Weak Areas: ${weakAreas || "Not specified"}

Session Topic:
${topic}

Tutor's Session Notes:
${notes || "No notes provided"}

Generate:
1. A concise summary of the session.
2. Two or three practical homework tasks for the student.
3. A clear focus for the student's next session.

Return ONLY valid JSON in exactly this structure:

{
  "summary": "A concise summary of the session.",
  "homework": [
    "homework task 1",
    "homework task 2",
    "homework task 3"
  ],
  "nextFocus": "What the student should focus on in the next session."
}
`;

    const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input: prompt,
    });

    try {
        return JSON.parse(response.output_text);
    } catch (error) {
        throw new Error("AI returned an invalid session debrief.");
    }
};

const generateProgressSummary = async ({
    studentName,
    subject,
    currentLevel,
    learningGoals,
    weakAreas,
    progressRecords,
}) => {
    const progressText = progressRecords
        .map(
            (record) =>
                `Topic: ${record.topic}
Score: ${record.score ?? "Not provided"}
Notes: ${record.notes || "No notes"}`
        )
        .join("\n\n");

    const prompt = `
You are an experienced educational progress assistant.

Analyze the student's learning progress.

Student:
${studentName}

Subject:
${subject}

Current Level:
${currentLevel || "Not specified"}

Learning Goals:
${learningGoals || "Not specified"}

Known Weak Areas:
${weakAreas || "Not specified"}

Progress Records:
${progressText || "No progress records available."}

Generate:
1. A concise overall progress summary.
2. The student's main strengths.
3. Areas that need improvement.
4. Recommended focus areas for future sessions.

Return ONLY valid JSON in exactly this structure:

{
  "summary": "Overall progress summary",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "areasToImprove": [
    "area 1",
    "area 2"
  ],
  "recommendations": [
    "recommendation 1",
    "recommendation 2"
  ]
}
`;

    const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input: prompt,
    });

    try {
        return JSON.parse(response.output_text);
    } catch (error) {
        throw new Error(
            "AI returned an invalid progress summary."
        );
    }
};

module.exports = {
    generateSessionPlan,
    generateSessionDebrief,
    generateProgressSummary,
};