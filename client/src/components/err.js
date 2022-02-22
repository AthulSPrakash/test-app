export default function Error(){
    return(
        <div style={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: '600',
            color: 'White',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5em',
            background: 'rgb(10,10,10)'
        }}>
            <h1 style={{fontSize: '5em'}}>404</h1>
            <h2>Page Not Found</h2>
        </div>
    )
}