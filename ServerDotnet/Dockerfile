FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5144
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:5144

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["ServerDotnet.csproj", "./"]
RUN dotnet restore "ServerDotnet.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ServerDotnet.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "ServerDotnet.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ServerDotnet.dll"]
