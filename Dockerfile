FROM odoo:18.0

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl wget gnupg \
    && wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y --no-install-recommends /tmp/google-chrome.deb \
    && rm -f /tmp/google-chrome.deb \
    && pip install --break-system-packages --no-cache-dir websocket-client \
    && rm -rf /var/lib/apt/lists/*

USER odoo
