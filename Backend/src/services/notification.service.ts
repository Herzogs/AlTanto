import { INotificationService } from './interfaces/notification.service.interface';
import { IReportDto } from '../models/reports.interface';
import { IGroupService } from './interfaces/group.service.interface';
import { IGroup, IGroupMember, IGroupUser } from '../models/group.interface';
import axios from 'axios';
import { IZoneService } from './interfaces/zone.service.interface';
import { IZoneReport, IZoneDto } from '../models/zone.interface';
import { IUserService } from './interfaces/user.service.interface';
import { IUser } from '../models/user.interface';

class NotificationService implements INotificationService {

  private groupService: IGroupService<IGroup, IGroupUser, IGroupMember>;
  private zoneService: IZoneService<IZoneDto, IZoneReport>;
  private userService: IUserService<IUser>

  constructor({ groupService, zoneService, userService }: { groupService: IGroupService<IGroup, IGroupUser, IGroupMember>, zoneService: IZoneService<IZoneDto, IZoneReport>, userService: IUserService<IUser> }) {
    this.groupService = groupService;
    this.zoneService = zoneService;
    this.userService = userService;
  }

  async sendNotificationToGroup(groupId: number, report: IReportDto): Promise<boolean> {
    const group: IGroupMember = await this.groupService.findMembersByGroupId(groupId);
    const listofmembers = group?.members;
    const dateNow = new Date().toLocaleString()

    listofmembers?.forEach(async (member) => {
      const message = `${report.content} - Fecha: ${dateNow}`;
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

  async sendNotificationToZone(report: IReportDto): Promise<boolean> {
    const listOfZones = await this.zoneService.findZoneByLocation(+report.location.latitude, +report.location.longitude);
    if(!listOfZones) return false;
    const dateNow = new Date().toLocaleString()
    
    for await (const zone of listOfZones) {
      const { name, phoneNumber } = zone;
      const message = `Atención Zona: ${name} - ${report.content} - Fecha: ${dateNow}`;
      const aux = await this.sendNotification(phoneNumber, message);
      if (aux?.status === 'failed') {
        console.error(`Error al enviar mensaje a ${phoneNumber}`);
      }
    }
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

  private formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber) {
      return `"+549${phoneNumber}"`
    }
    return '';
  }
}

export default NotificationService;
