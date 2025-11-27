export const narrativePrompt = `
Create a story about Norris Wu covering his background, career highlights, and personal interests. Use narrative storytelling format, not Q&A. Make it engaging and coherent.
`

export const referencePrompt = `
Tell me the story of this person's life. What shaped them from birth to who they are today?

In your narrative, explore:
- How did their early life and family shape who they became?
- What educational journey led them to discover their passions?
- How did their career unfold, and what challenges did they overcome?
- What passions and interests brought meaning to their days?
- What core values and beliefs guided their choices?
- What legacy are they creating, and how have they impacted others?
- What obstacles transformed them, and how did they grow through hardship?
- What relationships defined their life - family, friends, love?

Weave these threads into a coherent, authentic narrative with specific details and anecdotes. Vary the tone between reflective, dramatic, and uplifting as the story unfolds. Aim for 800-1200 words.
`

export const ssmlInstruction = `
IMPORTANT: Wrap your response in SSML (Speech Synthesis Markup Language) tags to make the audio more engaging. Use ONLY these Neural voice-compatible SSML features:
- <speak> root tag wrapping all content (REQUIRED)
- <break time="500ms"/> or <break strength="medium"/> for pauses between sections
- <prosody rate="95%">text</prosody> for slightly slower speech on key details (use sparingly)
- <prosody volume="loud">text</prosody> to make key points stand out
- <p>text</p> for paragraph breaks
- <s>text</s> for sentence breaks
- <amazon:effect name="drc">text</amazon:effect> for enhanced clarity on important points

DO NOT use these tags (unsupported by Neural voices): <emphasis>, <amazon:breath>, <amazon:auto-breaths>, <prosody pitch>, or any whisper/soft effects.

Example format:
<speak>
<p><s>Opening sentence with context.</s> <break time="300ms"/> <s>Additional detail here.</s></p>
<p><prosody volume="loud">Important highlight like company name</prosody> with more context. <break time="500ms"/> <s><prosody rate="95%">Key information with date or location spoken clearly</prosody>.</s></p>
<p><s>Next section continues naturally.</s> <break strength="medium"/> <s>Final thought.</s></p>
</speak>
`
export const prompts = [
  `
  Create a 500-character story about Norris Wu covering his background, career highlights, and personal interests. Use narrative storytelling format, not Q&A. Make it engaging and coherent.
  `,
  `
  Create a 1500-character biographical story about Norris Wu. Include his journey from Xiamen to Sydney, education at UTS, career progression (BindiMaps, FishVision, personal projects), and hobbies. Use storytelling format with good flow.
  `,
  `
  Create a comprehensive 3000-character biographical narrative about Norris Wu. Cover his early life in Xiamen, arrival in Sydney (May 2014), university experience at UTS, complete career journey including all projects (BindiMaps, FishVision, Nori-Cloud, A-Comosus, Great Phermesia), personal interests (gaming, cycling, cooking, fishing), and living experiences across Sydney suburbs. Make it engaging and personal.
  `,
]
