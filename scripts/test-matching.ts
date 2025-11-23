import { getTranscript } from '../server/utils/transcriptCache'
import { getAllSkills } from '../app/utils/skills'

async function testMatching() {
  // Get first transcript
  const transcript = await getTranscript('07Uez7-tZ0c')
  if (!transcript) {
    console.log('No transcript found')
    return
  }

  const fullText = transcript.segments.map(s => s.text).join(' ')
  console.log('Full text length:', fullText.length)
  console.log('First 200 chars:', fullText.substring(0, 200))
  console.log('\n')

  // Get skills
  const skills = getAllSkills('fa')
  console.log('Total skills:', skills.length)
  console.log('First skill:', skills[0])
  console.log('\n')

  // Test if skill name exists in text
  for (const skill of skills) {
    const skillName = skill.name.toLowerCase()
    const textLower = fullText.toLowerCase()
    
    if (textLower.includes(skillName)) {
      console.log(`✅ Found "${skill.name}" in transcript`)
    }
  }
  
  // Test some common words
  const testWords = ['زندگی', 'هدف', 'موفقیت', 'خود', 'آگاهی']
  console.log('\nTesting common words:')
  for (const word of testWords) {
    if (fullText.toLowerCase().includes(word.toLowerCase())) {
      console.log(`✅ Found "${word}"`)
    } else {
      console.log(`❌ Not found "${word}"`)
    }
  }
}

testMatching()
