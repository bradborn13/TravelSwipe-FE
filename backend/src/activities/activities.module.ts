import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivityService } from './activities.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivitiesSchema,
  Activities,
} from './infrastructure/schemas/activities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivityService],
})
export class ActivitiesModule {}
