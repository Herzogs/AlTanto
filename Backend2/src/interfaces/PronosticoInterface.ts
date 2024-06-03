interface IPronostico {
  id?: number;
  date?: Date;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  temp?: number | null;
  tempDesc?: string | null;
  description?: string | null;
  humidity?: number | null;
  pressure?: number | null;
  visibility?: number | null;
  windSpeed?: number | null;
  windDeg?: string | null;
  forecastType: 'today' | 'tomorrow';
}

export default IPronostico;
