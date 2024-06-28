import { INotificationService } from './interfaces/notification.service.interface';
import { IReportDto } from '../models/reports.interface';
import { IGroupService } from './interfaces/group.service.interface';
import { IGroup, IGroupMember, IGroupUser } from '../models/group.interface';
import axios from 'axios';

class NotificationService implements INotificationService {

  private groupService: IGroupService<IGroup, IGroupUser, IGroupMember>;

  constructor({ groupService }: { groupService: IGroupService<IGroup, IGroupUser, IGroupMember> }) {
    this.groupService = groupService;
  }

  async sendNotificationToGroup(groupId: number, report: IReportDto): Promise<boolean> {
    const group: IGroupMember = await this.groupService.findMembersByGroupId(groupId);
    const listofmembers = group?.members;
    listofmembers?.forEach(async (member) => {
      const message = `${report.content} - Fecha: ${report.createAt}`;
      const aux = await this.sendNotification(member.phoneNumber, message);
      if (aux?.status === 'failed') {
        console.error(`Error al enviar mensaje a ${member.phoneNumber}`);
      }
    });
    return true;
  }

  async sendNotificationToGroupSOS(groupId: number, userId: number, address: string): Promise<boolean> {
    const group: IGroupMember = await this.groupService.findMembersByGroupId(groupId);
    const listofmembers = group?.members;
    const userSOS = listofmembers.find(user => user.id == userId )

    listofmembers?.forEach(async (member) => {
      if (member.id != userSOS?.id){
        const message = `El usuario ${userSOS?.name} ${userSOS?.lastName} esta teniendo un problema y envio una alerta SOS. Ubicación detectada ${address}`;
        const aux = await this.sendNotification(member.phoneNumber, message);
        if (aux?.status === 'failed') {
          console.error(`Error al enviar mensaje a ${member.phoneNumber}`);
        }
      }

    });
    return true;
  }

  private async sendNotification(to: string, message: string) {
    const formattedNumber = this.formatPhoneNumber(to);
    try {
      
      const response = await axios.post('https://graph.facebook.com/v19.0/364446776749815/messages',
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedNumber,
          type: "template",
          template: {
            name: "nuevo",
            language: {
              code: "es_AR"
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: message
                  }
                ]
              }
            ]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CV_WHASTAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 200) {
        console.log('Notificación enviada con éxito');
        return { status: 'success' };
      } else {
        console.error('Error enviando notificación:', response.statusText);
        return { status: 'failed' };
      }
    } catch (error) {
      console.error('Error enviando notificación:', (error as Error).message);
      return { status: 'failed', error: (error as Error).message };
    }
  }

  private formatPhoneNumber(phoneNumber: string): any {
    if (phoneNumber) {
      return `"+549${phoneNumber}"`
    }
  }
}

export default NotificationService;
