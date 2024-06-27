import twilio from 'twilio';
import { INotificationService } from './interfaces/notification.service.interface';
import { IReportDto } from '../models/reports.interface';
import { IGroupService } from './interfaces/group.service.interface';
import { IGroup, IGroupMember, IGroupUser } from '../models/group.interface';

class NotificationService implements INotificationService {
  private twilioClient: twilio.Twilio;
  private groupService: IGroupService<IGroup, IGroupUser, IGroupMember>;

  constructor({ groupService }: { groupService: IGroupService<IGroup, IGroupUser, IGroupMember> }) {
    this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
    this.groupService = groupService;
  }

  async sendNotificationToGroup(groupId: number, report: IReportDto): Promise<boolean> {
    const group: IGroupMember = await this.groupService.findMembersByGroupId(groupId);
    const listofmembers = group?.members;
    listofmembers?.forEach(async (member) => {
      console.log(member);
      const message = `ATENCIÓN GRUPO ${group.name}\n${member.name} ${member.lastName} ha subido un reporte\nContenido: ${report.content}\nFecha: ${report.createAt}`;
      const aux = await this.sendNotification(member.phoneNumber, message);
      if (aux.status === 'failed') {
        console.error(`Error al enviar mensaje a ${member.phoneNumber}`);
      }
    });
    return true;
  }

  private async sendNotification(to: string, message: string) {
    const formattedNumber = this.formatPhoneNumber(to);
    return this.twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Número de WhatsApp de Twilio
      to: `whatsapp:${formattedNumber}`,
    });
  }

  private formatPhoneNumber(phoneNumber: string): string {
    let formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedNumber.startsWith('54')) {
      if (formattedNumber.length === 10) {
        // Número local (sin código de país) -> agregar 9 para móviles
        formattedNumber = `549${formattedNumber}`;
      } else if (formattedNumber.length === 11 && formattedNumber[2] !== '9') {
        // Número nacional (con código de país) pero sin 9 para móviles
        formattedNumber = `549${formattedNumber.slice(2)}`;
      }
    } else if (!formattedNumber.startsWith('54')) {
      // Número internacional sin código de país
      formattedNumber = `549${formattedNumber}`;
    }
    return `+${formattedNumber}`;
  }
}

export default NotificationService;
