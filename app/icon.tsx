import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: '#020617',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '25%',
          border: '1.5px solid #dc2626',
        }}
      >
        <span
          style={{
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-1px',
            fontFamily: 'sans-serif',
          }}
        >
          <span style={{ color: '#ef4444' }}>n</span>lg
        </span>
      </div>
    ),
    { ...size }
  );
}
