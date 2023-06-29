import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { Survey } from '@/schema/survey.schema';
import { JwtGuard } from '@/guards/jwt.guard';
import { SurveyDto } from './dto/survey.dto';

@Controller('survey')
@UseGuards(JwtGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async createSurvey(@Body() survey: Survey, @Req() req) {
    survey.ownerId = req.user.userId;
    return await this.surveyService.createSurvey(survey);
  }

  @Get()
  async getAllSurveys(
    @Req() req,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.surveyService.getAllSurveys(
      req.user.userId,
      page,
      pageSize,
    );
  }

  @Get(':id')
  async getSurveyById(@Param('id') id: string) {
    return await this.surveyService.getSurveyById(id);
  }

  @Put(':id')
  async updateSurvey(@Param('id') id: string, @Body() dto: SurveyDto) {
    const survey = { ...dto } as Survey;
    return await this.surveyService.updateSurvey(id, survey);
  }

  @Delete(':id')
  async deleteSurvey(@Param('id') id: string) {
    return await this.surveyService.deleteSurvey(id);
  }
}
