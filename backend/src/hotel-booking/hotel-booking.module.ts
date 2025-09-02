import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from './presentation/controllers/hotel.controller';
import { RoomController } from './presentation/controllers/room.controller';
import { HotelService } from './application/services/hotel.service';
import { RoomService } from './application/services/room.service';
import { HotelRepositoryImpl } from './infrastructure/repositories/hotel.repository.impl';
import { RoomRepositoryImpl } from './infrastructure/repositories/room.repository.impl';
import { HotelSchema, HotelMongoSchema } from './infrastructure/schemas/hotel.schema';
import { RoomSchema, RoomMongoSchema } from './infrastructure/schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelSchema.name, schema: HotelMongoSchema },
      { name: RoomSchema.name, schema: RoomMongoSchema },
    ]),
  ],
  controllers: [HotelController, RoomController],
  providers: [
    HotelService,
    RoomService,
    {
      provide: 'HotelRepository',
      useClass: HotelRepositoryImpl,
    },
    {
      provide: 'RoomRepository',
      useClass: RoomRepositoryImpl,
    },
  ],
  exports: [HotelService, RoomService],
})
export class HotelBookingModule {}