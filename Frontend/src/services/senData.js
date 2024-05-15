export const sendData = async (data) => {
    try {
        const response = await fetch('http://localhost:3000/api/report/create-report', {
            method: 'POST',
            body: data
        });

        if (response.ok) {
            console.log('Report submitted successfully!');
        } else {
            console.error('Failed to submit report:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting report:', error);
    }
};