# Azure Configuration & Access Information

## Resource Groups & Resources

### Primary Resource Group: `aks-java-chat-filter`

- **AKS Cluster**: myAKSCluster
- **Container Registry**: javachatfilter
- **Region**: [Add region]

### Secondary Resource Group: `aks-nextjs-chat-filter`

- **Purpose**: Next.js Chat Filter Frontend
- **Region**: [Add region]

## Service Ports & Deployment

| Service            | Port | Namespace          | Status  | External Access                             |
| ------------------ | ---- | ------------------ | ------- | ------------------------------------------- |
| Java Backend       | 8080 | chat-filter-app    | Running | http://[LoadBalancer-IP]:8080               |
| Next.js Frontend   | 3000 | chat-filter-app    | Running | http://[LoadBalancer-IP]:3000               |
| Soketi (WebSocket) | 443  | External (Railway) | Active  | wss://soketi-production-41a1.up.railway.app |

## Quick Access Commands

### Get Credentials

```bash
az account set --subscription <subscription-id>
az aks get-credentials --resource-group aks-java-chat-filter --name myAKSCluster
```

### View Logs (Correct Namespace)

```bash
# Java backend logs (REAL-TIME)
kubectl logs -f deployment/aks-java-chat-filter -n chat-filter-app

# Next.js frontend logs
kubectl logs -f deployment/aks-nextjs-chat-filter -n chat-filter-app

# Check pod status
kubectl get pods -n chat-filter-app

# Get deployment details
kubectl describe deployment aks-java-chat-filter -n chat-filter-app
```

### Container Registry

```bash
# Login to registry
az acr login --name javachatfilter

# List repositories
az acr repository list --name javachatfilter

# View image tags
az acr repository show-tags --name javachatfilter --repository aks-java-chat-filter
```

## Redeployment Steps

### 1. Build & Push Java Backend

```bash
# Build Docker image
docker build -t javachatfilter.azurecr.io/aks-java-chat-filter:latest .

# Login to registry
az acr login --name javachatfilter

# Push image
docker push javachatfilter.azurecr.io/aks-java-chat-filter:latest
```

### 2. Build & Push Next.js Frontend

```bash
# Build Next.js image
docker build -f Dockerfile.nextjs -t javachatfilter.azurecr.io/aks-nextjs-chat-filter:latest .

# Push image
docker push javachatfilter.azurecr.io/aks-nextjs-chat-filter:latest
```

### 3. Redeploy to AKS (Force pod restart with new images)

```bash
# Get credentials first
az aks get-credentials --resource-group aks-java-chat-filter --name myAKSCluster

# Restart deployments (will pull latest images)
kubectl rollout restart deployment/aks-java-chat-filter -n chat-filter-app
kubectl rollout restart deployment/aks-nextjs-chat-filter -n chat-filter-app

# Monitor rollout status
kubectl rollout status deployment/aks-java-chat-filter -n chat-filter-app
kubectl rollout status deployment/aks-nextjs-chat-filter -n chat-filter-app
```

### 4. Verify Deployment Success

```bash
# Check pod status
kubectl get pods -n chat-filter-app

# View real-time logs to confirm WebSocket connected
kubectl logs -f deployment/aks-nextjs-chat-filter -n chat-filter-app | grep -i "pusher\|connected"
```

## Recent Fixes

- **Feb 23, 2026**: Fixed WebSocket TLS configuration in `pusher.js`
  - Changed from `forceTLS: false` → `forceTLS: true`
  - Changed from unencrypted WS port 6001 → encrypted WSS port 443
  - Enabled encryption and restricted to WSS transport only

## Useful Links

- [Azure Portal - aks-java-chat-filter](https://portal.azure.com/#@/resource/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/aks-java-chat-filter)
- [Azure Portal - javachatfilter Registry](https://portal.azure.com/#@/resource/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/aks-java-chat-filter/providers/Microsoft.ContainerRegistry/registries/javachatfilter)

## Notes

- Created: February 23, 2026
- Last Updated: February 23, 2026
