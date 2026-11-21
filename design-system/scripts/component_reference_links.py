"""Native target safety shared by finite authored calls; no navigation is executed."""
import re

def safe_anchor_target(attrs, protocols=('http','https','mailto','tel'), require_disabled_role=False):
    if attrs.get('aria-disabled')=='true':
        # Even href="" can reload a page: disabled display must omit the attribute.
        return 'href' not in attrs and (not require_disabled_role or attrs.get('role')=='link')
    href=attrs.get('href','').strip()
    if not href:return False
    normalized=re.sub(r'[\x00-\x20]','',href)
    scheme=re.match(r'^([A-Za-z][A-Za-z0-9+.-]*):',normalized)
    return scheme is None or scheme[1].lower() in protocols
