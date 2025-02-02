from google.cloud import firestore
from google.cloud import storage
import os

def create_folder_and_update_document(event, context):
    """Triggered by a change to a Firestore document.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    # Get the Firestore document ID and bucket name
    resource_string = context.resource
    project_id = os.getenv('GCP_PROJECT')
    db = firestore.Client(project=project_id)
    
    # Parse the Firestore document path
    path_parts = resource_string.split('/documents/')[1].split('/')
    collection_path = path_parts[0]
    document_id = path_parts[1]
    
    # Get the document reference
    doc_ref = db.collection(collection_path).document(document_id)
    doc_snapshot = doc_ref.get()
    
    # Ensure the document exists
    if not doc_snapshot.exists:
        print(f'Document {document_id} does not exist!')
        return
    
    # Use the document ID as the book_id
    book_id = document_id
    
    # Create a folder in GCS
    bucket_name = 'scribe-main-bucket'
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    folder_path = f'{book_id}'
    
    # Create a blank blob to represent the folder
    blob = bucket.blob(folder_path)
    blob.upload_from_string('', content_type='application/x-www-form-urlencoded;charset=UTF-8')
    
    # Generate a link to the GCS folder
    bucket_link = f'https://storage.cloud.google.com/{bucket_name}/{folder_path}/book.pdf'
    
    # Update the Firestore document with the bucket link
    doc_ref.update({'bucket_link': bucket_link})
    
    print(f'Folder {folder_path} created in bucket {bucket_name} and document updated with bucket_link.')

