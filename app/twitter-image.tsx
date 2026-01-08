import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'All Sports Intelligence - Interactive World Map'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2px, transparent 0), radial-gradient(circle at 75px 75px, #1e293b 2px, transparent 0)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: '20px',
            border: '2px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
            }}
          >
            All Sports Intelligence
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#e2e8f0',
              textAlign: 'center',
              maxWidth: '700px',
            }}
          >
            Interactive World Map & Data Visualization
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#94a3b8',
              marginTop: '15px',
              textAlign: 'center',
            }}
          >
            Premium sports intelligence platform
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}