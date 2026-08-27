# Reusable Agent Prompt for LIBIF Final Exam Answers

Copy the prompt below and replace **[QUESTION_LIST]** with the desired question numbers or range, for example **[1-5]**, **[10, 12]**, or **[16-18]**.

---

## Prompt

Let us focus on answering the LIBIF final-exam questions in **[QUESTION_LIST]**.

The examination session is structured as follows:

- **10 minutes:** Write the answer to the main question on one A4 sheet.
- **2 minutes:** Select the related printed evidence and submit it with the handwritten answer.
- **Up to 10 minutes:** Answer follow-up questions, commonly based on the main answer, the submitted evidence, and any existing **Câu hỏi thường gặp** section.

### 1. Language constraint

Write the answer outputs mostly in Vietnamese.

Use English only when:

- the term is a recognized technical or management term commonly used in English; or
- translating it would sound unnatural in normal Vietnamese communication.

Examples that may remain in English include CI, CD, Continuous Integration, Continuous Delivery, DevOps, pipeline, build, deployment, staging, production, Pull Request, sprint, backlog, stakeholder, quality gate and UAT.

Do not translate terminology mechanically when Vietnamese speakers would normally retain the English term.

### 2. Evidence and scope constraints

Before writing any answer:

1. Read the exact wording of every selected question, including every item inside the **Sinh viên nộp kèm** parentheses.
2. Inspect the LIBIF repository for the actual documents, source code, workflows, screenshots, reports, configuration and historical project data relevant to that question.
3. Use what the team has actually implemented or documented.
4. Do not invent tools, processes, meetings, measurements, test results, customer feedback or infrastructure that the repository cannot demonstrate.
5. Distinguish clearly between:
   - what the team actually completed;
   - what was planned but not completed;
   - current limitations or future improvements.
6. Keep the discussion at Software Project Management level. Explain technical details only when they are needed to support a management decision or project result.

Repository evidence is the primary source of truth. External theory may clarify a concept, but it must not replace or contradict the team’s actual implementation.

### 3. Required outputs

For every selected question number **X**, create exactly three outputs in its finals directory:

- **QX-Written.md**
- **QX-Print.md**
- **QX-Prepare.md**

Also update that directory’s README with links to all generated outputs.

The filenames are organizational identifiers. The teacher-facing title inside **QX-Print.md** must be descriptive and formal; do not expose internal labels such as QX-P1, QX-P2 or preparation checklists in the printed content.

### 4. Written answer requirements

The Written answer is the version the student can reproduce by hand in approximately 10 minutes on one A4 sheet.

It must:

1. Answer every part of the main question directly.
2. Be concise, precise and easy to understand.
3. Prioritize WHAT the component/process/document does and WHY it is needed.
4. Avoid low-level implementation details unless the question explicitly requires them.
5. Use short paragraphs, bullets or a small table that can realistically be handwritten.
6. End with a short conclusion that directly answers the question’s purpose or value.

If the question requires a graph, model, process, lifecycle, hierarchy, matrix or pipeline:

- place a simple hand-drawable model at the top;
- label each component with the actual LIBIF tool, role or artifact;
- explain the main purpose of each component below it.

Do not force a pipeline diagram into questions that do not need one. For document-formation questions, a small input → formation → review → evaluation → update model may be used only when it improves clarity.

Target approximately 300–450 words, excluding the diagram, unless the question genuinely requires more.

### 5. Printed answer requirements

The Print answer is read directly by the teacher. It must be a self-contained evidence package, not a preparation guide for the student.

It must:

1. Cover every individual **Sinh viên nộp kèm** requirement in the original question.
2. Include the actual relevant content directly in the document:
   - embed screenshots or images;
   - include the necessary tables, report data or document sections;
   - include relevant implemented script/configuration excerpts;
   - include the actual project process, result or evidence being submitted.
3. Never replace evidence with only a list of repository paths or instructions such as print this file.
4. Source filenames may be shown as provenance, but the teacher must not need to open another file to understand the submitted evidence.
5. If the question requires a complete project document, do not replace it with an invented summary. Include the complete required content or a faithful self-contained print section that preserves all required parts.
6. Keep the package concise, but never omit a required attachment merely to reduce length.
7. Use project-specific data and implementation; do not provide generic out-of-the-box templates.
8. Remove student-facing preparation text such as physical checklists, internal IDs, drafting notes or instructions to select other files.
9. Never expose real passwords, tokens, private environment files, personal data or credentials. Use placeholders or redacted values while preserving the configuration structure needed as evidence.

A suitable title format is:

    BẢN IN NỘP KÈM — <TÊN NỘI DUNG CHÍNH THỨC>

### 6. QnA preparation requirements

The Prepare answer supports an oral QnA session of up to 10 minutes.

Generate likely teacher questions based only on:

- the Written answer;
- the Print evidence;
- the exact exam wording;
- existing **Câu hỏi thường gặp** content;
- real strengths, trade-offs and limitations of the LIBIF work.

The questions should remain appropriate for a Software Project Management course. Do not turn the session into a deep infrastructure, algorithm or framework interview unless the submitted evidence itself makes that detail necessary.

For each likely question, provide:

1. a direct answer that can be spoken in 20–40 seconds;
2. the concrete LIBIF evidence to mention;
3. the management meaning, decision or benefit;
4. a warning when there is a common misunderstanding or unsupported claim.

Use this oral structure whenever possible:

    Direct answer
      → LIBIF evidence
      → project-management purpose/result
      → limitation or trade-off, if relevant

Include questions that test:

- why the team chose the approach;
- how the work was formed, reviewed, evaluated or controlled;
- who was responsible;
- what evidence proves the claim;
- what happened when results differed from the plan;
- limitations and lessons learned;
- distinctions between similar concepts used in the answer.

Do not hide limitations. A precise statement such as the team implemented basic health checks but not full observability is better than claiming a capability the project does not have.

### 7. Consistency requirements

The three outputs for each question must support each other:

- Written states the main argument.
- Print proves that argument with actual project evidence.
- Prepare anticipates questions arising from those exact claims and evidence.

Do not introduce a major claim in Prepare that does not appear in or follow from Written and Print.

Use consistent names, dates, roles, metrics, environment policies and project status across all three outputs. If repository documents conflict, inspect the latest implemented source and explicitly use the current source of truth.

### 8. Validation before completion

Before reporting completion, verify that:

1. every selected question has all three output files;
2. every sub-question is answered;
3. every **Sinh viên nộp kèm** item is embedded in Print;
4. all local Markdown image/link targets resolve;
5. Print contains no internal QX-P labels, physical preparation checklist or references used as a substitute for evidence;
6. no secret or private credential is exposed;
7. Written is realistically hand-copyable in 10 minutes;
8. Prepare questions are based on the submitted Written and Print content;
9. all factual claims are supported by the LIBIF repository;
10. the directory README links to every generated output.

Report the created files, evidence coverage and any genuine remaining evidence gap. Do not commit or push unless explicitly requested.

---
