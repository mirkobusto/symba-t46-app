// The question shown when the guided questionnaire runs one question at a
// time; null shows every card. Cards stay mounted when hidden, so answers and
// the cards that appear on an answer (Q10, Q12) behave as on the single page.

import { createContext } from 'react'

export const QuestionStepContext = createContext<string | null>(null)
