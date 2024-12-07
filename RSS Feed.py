from telegram.ext import Updater, MessageHandler, Filters
import xml.etree.ElementTree as ET
from datetime import datetime

def add_to_feed(update, context):
    url = update.message.text
    try:
        # Load existing feed or create new
        try:
            tree = ET.parse('feed.xml')
            root = tree.getroot()
        except:
            root = ET.Element('rss', version='2.0')
            channel = ET.SubElement(root, 'channel')
            ET.SubElement(channel, 'title').text = 'My Media Feed'
            ET.SubElement(channel, 'description').text = 'Media links collection'
            tree = ET.ElementTree(root)

        # Add new item
        channel = root.find('channel')
        item = ET.SubElement(channel, 'item')
        ET.SubElement(item, 'title').text = f'Media {datetime.now().strftime("%Y-%m-%d %H:%M")}'
        ET.SubElement(item, 'link').text = url
        ET.SubElement(item, 'pubDate').text = datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0000")

        # Save feed
        tree.write('feed.xml', encoding='utf-8', xml_declaration=True)
        update.message.reply_text(f"Added to feed: {url}")
    except Exception as e:
        update.message.reply_text(f"Error: {str(e)}")

def main():
    updater = Updater("7690973510:AAFjevWDHpACk5K1X_h_6RkB2BN-5PpPNqU", use_context=True)
    dp = updater.dispatcher
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, add_to_feed))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
