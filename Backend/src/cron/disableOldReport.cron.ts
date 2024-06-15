import cron from 'node-cron';
import reportRepository from '../repository/reports.repository';

export const disableOldReport = cron.schedule(process.env.CRON_TIME as string, async () => {
  try {
    await reportRepository.disableOldReport();
  } catch (error) {
    console.error('An error occurred while disabling reports:', error);
  }
});
