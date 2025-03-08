FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["CodePilot.Services/CodePilot.Services.csproj", "CodePilot.Services/"]
RUN dotnet restore "CodePilot.Services/CodePilot.Services.csproj"
COPY . .
WORKDIR "/src/CodePilot.Services"
RUN dotnet build "CodePilot.Services.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "CodePilot.Services.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CodePilot.Services.dll"]
