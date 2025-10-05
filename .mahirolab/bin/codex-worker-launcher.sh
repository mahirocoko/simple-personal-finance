#!/bin/bash
# Codex Worker Launcher with Bash ID Integration
# Usage: ./codex-worker-launcher.sh [reasoning_level] [output_type] "task description"

VERSION="1.0.0"

# Exit code constants
EXIT_SUCCESS=0
EXIT_INVALID_INPUT=1
EXIT_TASK_FAILED=2

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Handle flags
if [ "$1" = "--version" ] || [ "$1" = "-v" ]; then
    echo "codex-worker-launcher v${VERSION}"
    exit $EXIT_SUCCESS
fi

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  Codex Background Worker Launcher   ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}USAGE:${NC}"
    echo "  ./codex-worker-launcher.sh [reasoning_level] [output_type] \"task\""
    echo "  ./codex-worker-launcher.sh [output_type] \"task\"  (defaults to low)"
    echo "  ./codex-worker-launcher.sh \"task\"  (defaults to low, workers)"
    echo ""
    echo -e "${YELLOW}REASONING LEVELS:${NC}"
    echo -e "  ${MAGENTA}minimal${NC}  - Fastest (~5-10s)"
    echo -e "  ${GREEN}low${NC}      - Balanced (~10-15s) ${CYAN}[DEFAULT]${NC}"
    echo -e "  ${YELLOW}medium${NC}   - Moderate (~15-25s)"
    echo -e "  ${RED}high${NC}     - Deepest (~30-60s+)"
    echo ""
    echo -e "${YELLOW}OUTPUT TYPES:${NC}"
    echo -e "  ${GREEN}workers${NC}   - General background tasks ${CYAN}[DEFAULT]${NC}"
    echo -e "  ${BLUE}research${NC}  - Research-related outputs"
    echo -e "  ${YELLOW}custom${NC}    - Custom output category"
    echo ""
    echo -e "${YELLOW}EXAMPLES:${NC}"
    echo "  ./codex-worker-launcher.sh \"Analyze codebase\""
    echo "  ./codex-worker-launcher.sh medium workers \"Refactor auth\""
    echo "  ./codex-worker-launcher.sh high \"Deep code analysis\""
    echo ""
    echo -e "${YELLOW}OUTPUT:${NC}"
    echo "  Logs saved to: ${CYAN}.mahirolab/{output_type}/${NC}"
    echo "  Format: ${CYAN}YYYYMMDD_HHMMSS_<PID>_codex_task.md${NC}"
    echo ""
    echo -e "${YELLOW}OPTIONS:${NC}"
    echo "  -h, --help     Show this help message"
    echo "  -v, --version  Show version information"
    exit $EXIT_SUCCESS
fi

# Check if task is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Error: No task description provided${NC}"
    echo -e "Run ${CYAN}'./codex-worker-launcher.sh --help'${NC} for usage information"
    exit $EXIT_INVALID_INPUT
fi

REASONING="${1:-low}"
OUTPUT_TYPE="${2:-workers}"  # workers, research, etc.
TASK="$3"

# Handle argument shifting
if [ $# -eq 2 ]; then
    REASONING="low"
    OUTPUT_TYPE="$1"
    TASK="$2"
elif [ $# -eq 1 ]; then
    REASONING="low"
    OUTPUT_TYPE="workers"
    TASK="$1"
fi

# Generate timestamp and temp filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TEMP_FILE=".mahirolab/${OUTPUT_TYPE}/${TIMESTAMP}_TEMP_codex_task.md"

# Create output directory if it doesn't exist
mkdir -p ".mahirolab/${OUTPUT_TYPE}"

echo -e "${BLUE}🚀 Launching Codex Worker${NC}"
echo -e "${YELLOW}Reasoning: ${REASONING}${NC}"
echo -e "${CYAN}Output Type: ${OUTPUT_TYPE}${NC}"
echo -e "${GREEN}Task: ${TASK}${NC}"
echo -e "${MAGENTA}Temp file: ${TEMP_FILE}${NC}"
echo "----------------------------------------"

# Launch Codex in background and capture bash ID
echo -e "${CYAN}Launching background process...${NC}"
BASH_ID=$(bash -c "
codex exec -s danger-full-access -c model_reasoning_effort='${REASONING}' '${TASK}. Save output to: ${TEMP_FILE}' &
echo \$!
" 2>/dev/null | tail -1)

echo -e "${BLUE}📋 Background process started with bash ID: ${BASH_ID}${NC}"

# Create proper filename with real bash ID
FINAL_FILE=".mahirolab/${OUTPUT_TYPE}/${TIMESTAMP}_${BASH_ID}_codex_task.md"

# Wait for temp file to be created, then rename
echo -e "${YELLOW}⏳ Waiting for output file creation...${NC}"
while [ ! -f "$TEMP_FILE" ]; do
    sleep 1
done

sleep 2  # Give it time to finish writing
mv "$TEMP_FILE" "$FINAL_FILE"

echo "----------------------------------------"
echo -e "${GREEN}✅ Task completed successfully${NC}"
echo -e "${CYAN}📄 Output saved to: ${FINAL_FILE}${NC}"
exit $EXIT_SUCCESS