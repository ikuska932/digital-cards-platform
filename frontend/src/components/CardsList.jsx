import { useEffect, useRef, useState } from "react"
import Card from "./Card"

const API_URL = "http://localhost:5000/api/cards"

export default function CardsList() {
  const [cards, setCards] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loaderRef = useRef(null)

  const fetchCards = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    const params = new URLSearchParams({
      limit: 5,
      ...(cursor && { cursor }),
    })

    const res = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const data = await res.json()

    setCards(prev => [...prev, ...data.cards])
    setCursor(data.nextCursor)
    setHasMore(data.hasMore)

    setLoading(false)
  }

  // первый запрос
  useEffect(() => {
    fetchCards()
  }, [])

  
  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchCards()
      }
    })

    observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [cursor, hasMore])

  return (
    <div>
      {cards.map(card => (
        <Card key={card._id} card={card} />
      ))}

      {hasMore && <div ref={loaderRef} style={{ height: 40 }} />}

      {loading && <p>Загрузка...</p>}
    </div>
  )
}
