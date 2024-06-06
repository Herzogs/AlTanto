const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m ` : ""}${s}s`;
  };
  
  const formatDistance = (meters) => {
    return (meters / 1000).toFixed(2) + " km";
  };
  
  export { formatDuration, formatDistance };