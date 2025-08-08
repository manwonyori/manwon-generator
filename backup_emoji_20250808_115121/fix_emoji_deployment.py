#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Emoji Removal Script for manwon-generator Render Deployment Fix
Based on cafe24-automation-hub proven emoji removal rules
"""

import os
import re
import json
import shutil
from pathlib import Path
from datetime import datetime

class ManwonEmojiCleaner:
    """Fix Render deployment by removing all emojis"""

    def __init__(self):
        self.base_path = Path("C:/Users/8899y/Documents/Projects/01/manwon-generator")
        self.backup_dir = self.base_path / "backup_before_emoji_fix"
        self.processed_count = 0
        self.emoji_removed_count = 0

        # Core files that must be emoji-free for deployment
        self.critical_files = [
            "app.py", "requirements.txt", "Dockerfile", "render.yaml",
            "*.html", "*.js", "*.json", "*.md", "*.bat", "*.sh"
        ]

        # Comprehensive emoji pattern from cafe24-automation-hub
        self.emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map symbols
            "\U0001F1E0-\U0001F1FF"  # flags (iOS)
            "\U00002500-\U00002BEF"  # chinese char
            "\U00002702-\U000027B0"
            "\U000024C2-\U0001F251"
            "\U0001f926-\U0001f937"
            "\U00010000-\U0010ffff"
            "\u2640-\u2642"
            "\u2600-\u2B55"
            "\u200d"
            "\u23cf"
            "\u23e9"
            "\u231a"
            "\ufe0f"  # dingbats
            "\u3030"
            "]+",
            re.UNICODE
        )

        print("[INFO] ManwonEmojiCleaner Initialized")
        print(f"[INFO] Target: {self.base_path}")

    def create_backup(self):
        """Create backup before processing"""
        if self.backup_dir.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.backup_dir = self.base_path / f"backup_emoji_{timestamp}"

        self.backup_dir.mkdir(exist_ok=True)

        # Backup critical files only (not git objects)
        extensions = ['.py', '.html', '.js', '.json', '.md', '.bat', '.sh', '.txt', '.yaml', '.yml']
        backed_up = 0

        for ext in extensions:
            for file_path in self.base_path.rglob(f"*{ext}"):
                if ".git" not in str(file_path) and "backup" not in str(file_path):
                    relative_path = file_path.relative_to(self.base_path)
                    backup_path = self.backup_dir / relative_path
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    try:
                        shutil.copy2(file_path, backup_path)
                        backed_up += 1
                    except Exception as e:
                        print(f"[WARN] Backup failed for {file_path.name}: {e}")

        print(f"[OK] Backed up {backed_up} files to {self.backup_dir.name}")
        return backed_up

    def clean_file(self, file_path: Path) -> int:
        """Remove emojis from any file type"""
        emoji_removed = 0

        try:
            # Read file with UTF-8 encoding
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            original_content = content

            # Remove emojis using the proven pattern
            matches = self.emoji_pattern.findall(content)
            for match in matches:
                content = content.replace(match, '')
                emoji_removed += 1

            # Clean up extra spaces and formatting
            content = re.sub(r'[ \t]+\n', '\n', content)  # Remove trailing spaces
            content = re.sub(r'\n\n\n+', '\n\n', content)  # Reduce multiple blank lines

            # Write back if changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

        except Exception as e:
            print(f"[ERROR] Failed to process {file_path.name}: {e}")

        return emoji_removed

    def process_all_files(self):
        """Process all files in the project"""
        print("\n[INFO] Processing files for emoji removal...")

        # Extensions to process (all text files)
        extensions = ['.py', '.html', '.js', '.json', '.md', '.bat', '.sh', '.txt', '.yaml', '.yml', '.css']

        for ext in extensions:
            print(f"\n[INFO] Processing {ext} files...")
            files = list(self.base_path.rglob(f"*{ext}"))

            # Skip git objects and backup files
            files = [f for f in files if ".git/objects" not in str(f) and "backup" not in str(f)]

            for file_path in files:
                emoji_count = self.clean_file(file_path)
                if emoji_count > 0:
                    print(f"   [CLEAN] {file_path.name}: {emoji_count} emojis removed")
                    self.emoji_removed_count += emoji_count
                self.processed_count += 1

        print(f"\n[OK] Processed {self.processed_count} files")
        print(f"[OK] Removed {self.emoji_removed_count} emojis total")

    def verify_critical_files(self):
        """Verify critical deployment files are emoji-free"""
        print("\n[INFO] Verifying critical deployment files...")

        critical_files = [
            self.base_path / "app.py",
            self.base_path / "requirements.txt",
            self.base_path / "Dockerfile",
            self.base_path / "render.yaml"
        ]

        all_clean = True

        for file_path in critical_files:
            if file_path.exists():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    matches = self.emoji_pattern.findall(content)
                    if matches:
                        print(f"   [ERROR] {file_path.name}: {len(matches)} emojis still found")
                        all_clean = False
                    else:
                        print(f"   [OK] {file_path.name}: clean")

                except Exception as e:
                    print(f"   [ERROR] Failed to verify {file_path.name}: {e}")
                    all_clean = False
            else:
                print(f"   [WARN] {file_path.name}: not found")

        return all_clean

    def create_deployment_ready_marker(self):
        """Create marker file indicating deployment readiness"""
        marker_path = self.base_path / "EMOJI_CLEAN_FOR_RENDER.txt"

        with open(marker_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Emoji Cleanup Complete for Render Deployment

Timestamp: {datetime.now().isoformat()}
Files Processed: {self.processed_count}
Emojis Removed: {self.emoji_removed_count}
Backup Location: {self.backup_dir.name}

Status: READY FOR RENDER DEPLOYMENT

Next Steps:
1. Commit and push to GitHub
2. Trigger Render redeploy
3. Check https://manwon-generator.onrender.com/health

Generated by ManwonEmojiCleaner based on cafe24-automation-hub rules
""")

        print(f"[OK] Created deployment marker: {marker_path.name}")

    def run_fix(self):
        """Execute complete emoji fix for Render deployment"""
        print("="*60)
        print(" MANWON-GENERATOR EMOJI FIX FOR RENDER DEPLOYMENT")
        print("="*60)
        print("Based on cafe24-automation-hub proven emoji removal rules")

        # Create backup
        print("\n[1/4] Creating backup...")
        self.create_backup()

        # Process all files
        print("\n[2/4] Removing emojis from all files...")
        self.process_all_files()

        # Verify critical files
        print("\n[3/4] Verifying critical deployment files...")
        is_clean = self.verify_critical_files()

        # Create deployment marker
        print("\n[4/4] Creating deployment ready marker...")
        self.create_deployment_ready_marker()

        # Final status
        print("\n" + "="*60)
        if is_clean and self.emoji_removed_count > 0:
            print(" EMOJI FIX COMPLETE - READY FOR RENDER DEPLOYMENT")
            print("="*60)
            print(f"[SUCCESS] {self.emoji_removed_count} emojis removed from {self.processed_count} files")
            print("[SUCCESS] All critical deployment files are clean")
            print("[NEXT] Run SUPERCLAUD_DEPLOY.bat to deploy to Render")
        elif self.emoji_removed_count == 0:
            print(" NO EMOJIS FOUND - DEPLOYMENT READY")
            print("="*60)
            print("[INFO] No emojis found in project files")
            print("[NEXT] Deployment issue may be elsewhere")
        else:
            print(" EMOJI FIX INCOMPLETE - MANUAL REVIEW REQUIRED")
            print("="*60)
            print("[WARNING] Some emojis may still remain")
            print("[ACTION] Check files manually and retry")

        print("="*60)
        return is_clean

def main():
    """Main execution"""
    try:
        cleaner = ManwonEmojiCleaner()
        success = cleaner.run_fix()

        if success:
            print("\n[READY] Project is now emoji-free and ready for Render deployment")
            print("[NEXT] Run: SUPERCLAUD_DEPLOY.bat")
        else:
            print("\n[RETRY] Some issues remain, please review and retry")

    except Exception as e:
        print(f"\n[ERROR] Fix process failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()