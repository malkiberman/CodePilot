# Image based on ASP.NET Core runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5244
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:5244

# Image based on SDK to build the solution
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src

# Copy the solution file and all projects
COPY ["CodePilot.sln", "./"]
COPY ["CodePilot.Api/CodePilot.Api.csproj", "CodePilot.Api/"]
COPY ["Library1/Library1.csproj", "Library1/"]
COPY ["Library2/Library2.csproj", "Library2/"]

# Restore the dependencies for all projects in the solution
RUN dotnet restore "CodePilot.sln"

# Copy the rest of the application files
COPY . .

# Build the application (all projects) and output to /app/build
WORKDIR "/src/CodePilot.Api"
RUN dotnet build "CodePilot.Api.csproj" -c $configuration -o /app/build

# Publish the API project
FROM build AS publish
RUN dotnet publish "CodePilot.Api.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

# Use the runtime image to serve the app
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CodePilot.Api.dll"]
