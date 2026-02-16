import { Controller, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('locations')
  async findLocations() {
    return await this.locationsService.getLocationSuggestions();
  }
}
