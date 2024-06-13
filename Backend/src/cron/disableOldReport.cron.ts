import cron from 'node-cron';
import reportRepository from '../repository/models/reports.repository';

export const disableOldReport = cron.schedule(process.env.CRON_TIME_TEST as string, async () => {
  try {
    const disabled = await reportRepository.disableOldReport();
    console.log(`Disabled ${disabled} reports at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('An error occurred while disabling reports:', error);
  }
});
