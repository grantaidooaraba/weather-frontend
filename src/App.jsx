import { useRef, useState } from 'react'
import './App.css'

const iconFor = (main = '') => ({ Clear: '☀', Clouds: '☁', Rain: '☂', Drizzle: '☂', Thunderstorm: 'ϟ', Snow: '❄', Mist: '≋', Haze: '≋', Fog: '≋' })[main] || '◌'

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('Search any city to see what the sky feels like.')
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)
  async function search(event) {
    event.preventDefault()
    const query = city.trim()
    if (!query) { setMessage('Enter a city name to begin.'); setStatus('error'); return }
    const id = ++requestId.current
    setLoading(true); setMessage('Checking the sky…'); setStatus('loading')
    try {
      const key = import.meta.env.VITE_OPENWEATHER_API_KEY
      if (!key) throw new Error('Add your OpenWeatherMap key as VITE_OPENWEATHER_API_KEY to a local .env file.')
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${encodeURIComponent(key)}&units=metric`)
      if (response.status === 404) throw new Error(`We couldn't find “${query}”. Check the spelling and try again.`)
      if (!response.ok) throw new Error(response.status === 401 ? 'The weather API key is missing or invalid.' : 'The weather service is unavailable right now. Please try again.')
      const data = await response.json()
      if (!data?.name || !Number.isFinite(data?.main?.temp) || !Number.isFinite(data?.main?.feels_like) || !Number.isFinite(data?.main?.humidity) || !data?.weather?.[0]?.main || !data?.weather?.[0]?.description) throw new Error('The weather service returned incomplete data. Please try another search.')
      if (id !== requestId.current) return
      setWeather(data); setStatus('success'); setMessage('')
    } catch (error) { if (id === requestId.current) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.') } }
    finally { if (id === requestId.current) setLoading(false) }
  }
  const main = weather?.weather?.[0]?.main || ''
  return <main className={`weather-page ${main.toLowerCase()}`}>
    <header className="topbar"><a className="wordmark" href="./">⛅ Weather, outside</a><span className="live"><i /> LIVE CONDITIONS</span></header>
    <section className="intro"><p className="eyebrow">A LITTLE WINDOW TO THE WORLD</p><h1>How does it feel<br/>out there?</h1><p className="lede">A clear read on the weather, wherever you are.</p>
      <form onSubmit={search} className="search"><label className="sr-only" htmlFor="city">City name</label><span aria-hidden="true">⌕</span><input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Try Reykjavík, Tokyo, or home" autoComplete="off"/><button disabled={loading}>{loading ? 'Looking…' : 'Find weather'} <span aria-hidden="true">→</span></button></form>
      <p className={`notice ${status}`} role="status" aria-live="polite">{message}</p>
    </section>
    {weather && <section className="weather-card" aria-label={`Current weather in ${weather.name}`}><div className="weather-head"><div><p className="eyebrow">RIGHT NOW IN</p><h2>{weather.name}{weather.sys?.country ? <small>, {weather.sys.country}</small> : null}</h2><p className="condition">{weather.weather[0].description}</p></div><div className="weather-icon" aria-hidden="true">{iconFor(main)}</div></div><div className="temperature">{Math.round(weather.main.temp)}<sup>°</sup><span>C</span></div><div className="weather-facts"><div><span>FEELS LIKE</span><b>{Math.round(weather.main.feels_like)}°</b></div><div><span>HUMIDITY</span><b>{weather.main.humidity}%</b></div><div><span>WIND</span><b>{Number.isFinite(weather.wind?.speed) ? `${weather.wind.speed.toFixed(1)} m/s` : '—'}</b></div></div></section>}
    <footer><span>Weather data by OpenWeatherMap</span><span>Take the day as it comes.</span></footer>
  </main>
}
