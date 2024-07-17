import { createFileRoute } from '@tanstack/react-router'
// import { Loader } from '@/components/loader'


export const Route = createFileRoute('/timeframe')({
    
    // Preload plotly.js so it's in the cache
    beforeLoad: () => {},
    loader: () => {
        import('plotly.js-dist-min').then(()=>console.log('Loaded plotly'))
    }
})







