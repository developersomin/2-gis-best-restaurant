import {OpenApiService} from "./open-api.service";
import {Module} from "@nestjs/common";

@Module({
    imports: [],
    controllers: [],
    providers: [OpenApiService],
    exports: [OpenApiService],
})
export class OpenApiModule {}