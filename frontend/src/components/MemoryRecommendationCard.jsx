// Highlighted card for the recommended memory technique. Given prominence
// because picking the right study method is the most actionable takeaway.
import { memoryMethodTitle, explanationText } from '../utils.js'
import { useT } from '../i18n.jsx'

export default function MemoryRecommendationCard({ method, explanation }) {
  const t = useT()
  const title = memoryMethodTitle(method)
  const expl = explanationText('recommended_memory_method', method, explanation)

  return (
    <div className="card card-lg memory-hero">
      <div className="eyebrow">{t('Recommended memory method', 'Препорачана меморсиска техника')}</div>
      <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p className="lead">
        {expl ||
          t('Give this technique a try in your next study session — small, consistent practice makes it stick.', 'Пробај ја оваа техника на следната сесија — малата, доследна вежба прави да остане.')}
      </p>
    </div>
  )
}
