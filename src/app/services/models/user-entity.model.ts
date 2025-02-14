export interface UserEntity {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  mail: string;
  profileImg: string;
  secretKey: string;
  coins: number;
  roles: any[];
  skins: any[];
}
