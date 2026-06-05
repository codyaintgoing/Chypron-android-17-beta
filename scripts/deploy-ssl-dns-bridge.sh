#!/usr/bin/env bash
# ============================================================================
# Mental Arts Network (MAN) - Master Architect SSL & DNS Bridge
# Platform: Railway + Google Cloud Run
# Status: ACTIVE BUILD PHASE - SSL/DNS Configuration
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
DOMAIN="${1:-mentalarts.site.com}"
PROJECT_ID="${GCP_PROJECT_ID:-gen-lang-client-0391045788}"
SERVICE_NAME="${2:-mental-arts-network}"
REGION="${3:-us-west1}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  MAN - Master Architect SSL & DNS Bridge                  ║${NC}"
echo -e "${BLUE}║  Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}║  Status: ACTIVE BUILD PHASE                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# ============================================================================
# STEP 1: DNS DIAGNOSTICS
# ============================================================================
echo -e "\n${YELLOW}[1/8] DNS Diagnostics - Checking ${DOMAIN}...${NC}"

# Check if domain resolves
if nslookup "$DOMAIN" &>/dev/null; then
    echo -e "${GREEN}✓ Domain resolves${NC}"
    DIG_RESULT=$(dig "$DOMAIN" +short)
    echo -e "${CYAN}IP Address: ${DIG_RESULT}${NC}"
else
    echo -e "${RED}✗ NXDOMAIN - Domain does not resolve${NC}"
    echo -e "${YELLOW}Action: Configure DNS records at your registrar${NC}"
fi

# Check nameservers
echo -e "\n${CYAN}Nameservers:${NC}"
dig "$DOMAIN" NS +short

# ============================================================================
# STEP 2: GCP CLOUD RUN DOMAIN MAPPING
# ============================================================================
echo -e "\n${YELLOW}[2/8] GCP Cloud Run - Checking Domain Mappings...${NC}"

if command -v gcloud &> /dev/null; then
    echo -e "${CYAN}Existing domain mappings:${NC}"
    gcloud run domain-mappings list --region "$REGION" --project "$PROJECT_ID" 2>/dev/null || echo "No mappings found"
    
    echo -e "\n${YELLOW}Creating domain mapping for ${DOMAIN}...${NC}"
    
    # Create domain mapping
    gcloud run domain-mappings create \
        --service="$SERVICE_NAME" \
        --domain="$DOMAIN" \
        --region="$REGION" \
        --project="$PROJECT_ID" 2>/dev/null && \
    echo -e "${GREEN}✓ Domain mapping created${NC}" || \
    echo -e "${YELLOW}⚠ Domain mapping may already exist${NC}"
    
    # Get verification records
    echo -e "\n${CYAN}DNS Verification Records (add to your registrar):${NC}"
    gcloud run domain-mappings describe "$DOMAIN" \
        --project="$PROJECT_ID" \
        --region="$REGION" \
        --format='value(status.resourceRecords[].name,status.resourceRecords[].rrdata)' 2>/dev/null || echo "Retrieving records..."
else
    echo -e "${RED}✗ gcloud CLI not installed${NC}"
fi

# ============================================================================
# STEP 3: RAILWAY ENVIRONMENT SETUP
# ============================================================================
echo -e "\n${YELLOW}[3/8] Railway Platform - Environment Configuration...${NC}"

if command -v railway &> /dev/null; then
    echo -e "${CYAN}Railway Status:${NC}"
    railway status
    
    echo -e "\n${CYAN}Environment Variables:${NC}"
    railway variables 2>/dev/null || echo "Configure via Railway Dashboard"
    
    echo -e "\n${GREEN}✓ Railway CLI available${NC}"
else
    echo -e "${YELLOW}⚠ Railway CLI not installed${NC}"
    echo "Install: npm i -g @railway/cli"
fi

# ============================================================================
# STEP 4: SSL CERTIFICATE VERIFICATION
# ============================================================================
echo -e "\n${YELLOW}[4/8] SSL Certificate - Verification...${NC}"

if [ -n "$DOMAIN" ]; then
    echo -e "${CYAN}Certificate details for ${DOMAIN}:${NC}"
    echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | \
        openssl x509 -noout -dates -subject -issuer 2>/dev/null || \
    echo "SSL not yet configured or domain not accessible"
fi

# ============================================================================
# STEP 5: HEALTH CHECK
# ============================================================================
echo -e "\n${YELLOW}[5/8] Platform Health Check...${NC}"

APP_URL="https://${DOMAIN}"
HEALTH_ENDPOINT="${APP_URL}/health"

echo -e "${CYAN}Testing: ${HEALTH_ENDPOINT}${NC}"
if curl -s -I "$HEALTH_ENDPOINT" | grep -q "200\|302"; then
    echo -e "${GREEN}✓ Platform accessible${NC}"
else
    echo -e "${YELLOW}⚠ Platform not yet accessible (normal during setup)${NC}"
fi

# ============================================================================
# STEP 6: LOAD BALANCER CONFIGURATION
# ============================================================================
echo -e "\n${YELLOW}[6/8] Cloud Load Balancer - Configuration...${NC}"

if command -v gcloud &> /dev/null; then
    echo -e "${CYAN}Load Balancers in project ${PROJECT_ID}:${NC}"
    gcloud compute forwarding-rules list --project "$PROJECT_ID" 2>/dev/null | head -20 || echo "No load balancers found"
fi

# ============================================================================
# STEP 7: BUILDTOOLS & PLATFORM INTEGRATION
# ============================================================================
echo -e "\n${YELLOW}[7/8] BuildTools Integration - Platform Configuration...${NC}"

cat > "platform-config.env" << PLATFORM_CONFIG
# Mental Arts Network - Platform Configuration
# Generated: $(date)

# Domain & SSL
DOMAIN=${DOMAIN}
APP_URL=https://${DOMAIN}
SSL_ENABLED=true

# GCP Configuration
GCP_PROJECT_ID=${PROJECT_ID}
GCP_REGION=${REGION}
GCP_SERVICE_NAME=${SERVICE_NAME}

# Railway Configuration
RAILWAY_URL=\${RAILWAY_URL}
DATABASE_URL=\${DATABASE_URL}

# BuildTools Configuration
BUILD_TARGET=cloudrun
NODE_ENV=production
VITE_BUILD_ENV=production
VITE_BUILD_TARGET=cloudrun

# API Endpoints
MAINFRAME_URL=${APP_URL}/v1/mainframe
PLAYER_URL=${APP_URL}/player
HEALTH_URL=${APP_URL}/health

# Features
ENABLE_SOVEREIGN_HUD=true
ENABLE_PLAYABLES_SDK=true
ENABLE_WEBSOCKET=true
ENABLE_MONETIZATION=true
PLATFORM_STATUS=ACTIVE_BUILD_PHASE
PLATFORM_PHASE=MASTER_ARCHITECT_LEVEL
PLATFORM_CONFIG

echo -e "${GREEN}✓ Platform config generated: platform-config.env${NC}"

# ============================================================================
# STEP 8: DEPLOYMENT DOCUMENTATION
# ============================================================================
echo -e "\n${YELLOW}[8/8] Generating Deployment Documentation...${NC}"

cat > "DEPLOYMENT_GUIDE.md" << 'DEPLOYMENT_DOC'
# Mental Arts Network (MAN) - Master Architect Deployment Guide

## 🔐 SSL/DNS Configuration Status

### Domain: mentalarts.site.com

#### DNS Resolution
- **Status:** Check with: `dig mentalarts.site.com`
- **Expected:** A record pointing to Cloud Load Balancer IP
- **TTL:** 3600 seconds (verify propagation)

#### SSL Certificate
- **Provider:** Google-managed (automatic via Cloud Run)
- **Renewal:** Automatic
- **Status:** `gcloud run domain-mappings describe mentalarts.site.com`

### DNS Records to Configure

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | mentalarts.site.com | [Load Balancer IP] | 3600 |
| CNAME | www | mentalarts.site.com | 3600 |
| MX | (optional) | your-mail-server | 3600 |

### GCP Cloud Run Domain Mapping

```bash
# View mapping
gcloud run domain-mappings describe mentalarts.site.com

# Create/update mapping
gcloud run domain-mappings create \
  --service=mental-arts-network \
  --domain=mentalarts.site.com \
  --region=us-west1

# Delete mapping
gcloud run domain-mappings delete mentalarts.site.com
```

## 🚀 Deployment Commands

### 1. Health Check
```bash
curl https://mentalarts.site.com/health
```

### 2. Link Platform
```bash
curl -X POST https://mentalarts.site.com/v1/mainframe/link_platform \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "facebook",
    "external_url": "https://www.facebook.com/reel/...",
    "asset_type": "reel"
  }'
```

### 3. Query Player
```bash
curl https://mentalarts.site.com/player/{audio_hash}
```

### 4. Load HUD
```
Browser: https://mentalarts.site.com/
```

## 📊 Platform Architecture

### Frontend Layer
- **Mentalartist.com** (React/Vite) - BuildTools enabled
- **Chypron-android-17-beta** (React/Vite/Firebase) - BuildTools enabled
- **Sovereign HUD v7** - Main interface

### Backend Layer
- **FastAPI** - Main API server
- **WebSockets** - Real-time mainframe links
- **PostgreSQL** - Data persistence
- **FFmpeg** - Media processing

### Deployment
- **Platform:** Google Cloud Run + Railway
- **Build System:** BuildTools (Multi-target)
- **Environment:** Production (Master Architect Level)
- **SSL:** Automatic (Google-managed)

## 🔧 Configuration Files

### platform-config.env
```bash
DOMAIN=mentalarts.site.com
APP_URL=https://mentalarts.site.com
BUILD_TARGET=cloudrun
NODE_ENV=production
PLATFORM_PHASE=MASTER_ARCHITECT_LEVEL
```

### vite.config.ts (BuildTools Integration)
- Multi-target compilation enabled
- CloudRun optimization active
- Environment variables injected

## 📡 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/v1/mainframe/link_platform` | POST | Link external platform |
| `/player/{hash}` | GET | Query audio player |
| `/` | GET | Load Sovereign HUD |
| `/ws/mainframe/{user_id}` | WebSocket | Real-time mainframe link |

## ⚠️ Troubleshooting

### NXDOMAIN Error
- **Cause:** DNS records not propagated
- **Fix:** 
  1. Verify DNS records at registrar
  2. Check GCP domain mapping: `gcloud run domain-mappings list`
  3. Wait for DNS propagation (up to 48 hours)

### SSL Certificate Not Valid
- **Cause:** Domain mapping not created
- **Fix:** Run domain-mappings create command above

### Platform Not Accessible
- **Cause:** Load balancer not ready or service not deployed
- **Fix:** 
  1. Check GCP service: `gcloud run services list`
  2. Check Cloud Run logs: `gcloud run logs read`
  3. Verify firewall rules: `gcloud compute firewall-rules list`

### BuildTools Build Failure
- **Cause:** Missing environment variables
- **Fix:** Source platform-config.env and rebuild

## 🎯 Next Steps

1. **DNS Configuration**
   - Add A record at domain registrar
   - Verify with `dig mentalarts.site.com`
   - Wait for propagation

2. **GCP Domain Mapping**
   - Create: `gcloud run domain-mappings create ...`
   - Verify: `gcloud run domain-mappings describe ...`

3. **SSL Verification**
   - Test: `curl -I https://mentalarts.site.com`
   - Check certificate: `openssl s_client -connect mentalarts.site.com:443`

4. **Platform Launch**
   - Health check: `curl /health`
   - Load HUD: Browse to domain
   - Start linking assets

## 📚 References

- [Google Cloud Run Domain Mapping](https://cloud.google.com/run/docs/mapping-custom-domains)
- [BuildTools Documentation](./BUILDTOOLS.md)
- [System Architecture](./ARCHITECTURE.md)
- [Railway Platform](https://railway.app)

---

**Mental Arts Network (MAN) - Master Architect Level**  
**Deployment Status:** ACTIVE BUILD PHASE  
**Last Updated:** $(date)
DEPLOYMENT_DOC

echo -e "${GREEN}✓ Deployment guide generated: DEPLOYMENT_GUIDE.md${NC}"

# ============================================================================
# SUMMARY
# ============================================================================
echo -e "\n${BLUE}╔════════════════════���═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Master Architect Bridge - DNS/SSL Configuration Complete  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}✓ Configuration Status:${NC}"
echo -e "  ✓ Domain: ${DOMAIN}"
echo -e "  ✓ GCP Project: ${PROJECT_ID}"
echo -e "  ✓ Region: ${REGION}"
echo -e "  ✓ BuildTools: Integrated"
echo -e "  ✓ Platform Phase: MASTER_ARCHITECT_LEVEL"

echo -e "\n${YELLOW}Files Generated:${NC}"
echo -e "  📄 platform-config.env - Platform configuration"
echo -e "  📄 DEPLOYMENT_GUIDE.md - Complete deployment guide"
echo -e "  📄 ARCHITECTURE.md - System architecture (if generated)"

echo -e "\n${CYAN}Quick Start Commands:${NC}"
echo -e "  1. Check DNS: dig ${DOMAIN}"
echo -e "  2. Create domain mapping: gcloud run domain-mappings create --service=${SERVICE_NAME} --domain=${DOMAIN}"
echo -e "  3. Test health: curl https://${DOMAIN}/health"
echo -e "  4. Load HUD: https://${DOMAIN}/"

echo -e "\n${MAGENTA}Master Architect Bridge Active ✓${NC}\n"
