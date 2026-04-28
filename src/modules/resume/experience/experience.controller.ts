// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ExperienceService } from './experience.service';
// import { CreateExperienceDto } from './dto/create-experience.dto';
// import { UpdateExperienceDto } from './dto/update-experience.dto';
//
// @Controller('experience')
// export class ExperienceController {
//   constructor(private readonly experienceService: ExperienceService) {}
//
//   @Post()
//   @UseGuards(AuthGuard('jwt'))
//   create(@Body() dto: CreateExperienceDto) {
//     // توجه: this.aboutService.getAboutEntity() رو باید در AboutService عمومی کنی
//     // یا از طریق AboutService یک about دریافت کنی.
//     // برای سادگی فعلاً فرض می‌کنیم aboutId=1 را در سرویس ست می‌کنی.
//     // در عمل باید about را از طریق AboutService بگیرید.
//     throw new Error('Not implemented – use AboutService to create experiences');
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string, @Query('lang') lang: string = 'fa') {
//     return this.experienceService.getByLanguage(+id, lang);
//   }
//
//   @Patch(':id')
//   @UseGuards(AuthGuard('jwt'))
//   update(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
//     return this.experienceService.update(+id, dto);
//   }
//
//   @Delete(':id')
//   @UseGuards(AuthGuard('jwt'))
//   remove(@Param('id') id: string) {
//     return this.experienceService.remove(+id);
//   }
// }