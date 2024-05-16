
function Test() {
    const handleClick = () => {
        const description = 'Ingrese descripcion';
        const categoryId = 2
        const latitude = 2
        const longitude = 2

        fetch('http://localhost:3000/api/report/create-report', {
            method: 'POST',
            body: JSON.stringify({ description, categoryId, latitude, longitude }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('Button clicked!');
    }

    return (
        <div>
            <button onClick={handleClick}>Click me</button>
        </div>
    )
}

export default Test