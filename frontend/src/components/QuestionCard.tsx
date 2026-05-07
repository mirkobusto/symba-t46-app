import type { Question } from '../types/api'

interface QuestionCardProps {
  question: Question
  selectedValue?: unknown
  onSelect: (value: unknown) => void
  disabled?: boolean
}

function valueKey(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
  disabled,
}: QuestionCardProps) {
  const selectedKey =
    selectedValue !== undefined ? valueKey(selectedValue) : null

  return (
    <article className="question-card">
      <header>
        <span className="question-id">{question.id.toUpperCase()}</span>
        <h2>{question.label}</h2>
        {question.description ? (
          <p className="question-description">{question.description}</p>
        ) : null}
      </header>
      <ul className="question-options">
        {question.options.map((opt) => {
          const key = valueKey(opt.value)
          const isSelected = selectedKey === key
          return (
            <li key={key}>
              <button
                type="button"
                className={
                  isSelected
                    ? 'option-button option-button-selected'
                    : 'option-button'
                }
                onClick={() => onSelect(opt.value)}
                disabled={disabled}
                aria-pressed={isSelected}
              >
                <span className="option-value">{key}</span>
                <span className="option-label">{opt.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
