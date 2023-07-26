import React, { useState } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'

const MAX_FILES_ALLOWED = 100

const YandexDiskUploader = () => {
	const [uploadedFiles, setUploadedFiles] = useState([])

	const onDrop = async acceptedFiles => {
		if (uploadedFiles.length + acceptedFiles.length > MAX_FILES_ALLOWED) {
			alert(`You can upload up to ${MAX_FILES_ALLOWED} files at a time.`)
			return
		}

		const formData = new FormData()

		acceptedFiles.forEach(file => {
			formData.append('files', file)
		})

		try {
			const response = await axios.post(
				'https://cloud-api.yandex.net/v1/disk/resources/upload',
				formData,
				{
					headers: {
						Authorization: 'Bearer YOUR_YANDEX_DISK_ACCESS_TOKEN',
					},
				}
			)

			setUploadedFiles(prevFiles => [
				...prevFiles,
				...response.data.map(file => file.name),
			])

			alert('Files uploaded successfully!')
		} catch (error) {
			console.error('Error uploading files:', error)
			alert('Error uploading files. Please try again later.')
		}
	}

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		multiple: true,
	})

	return (
		<div>
			<div {...getRootProps()} style={dropzoneStyles}>
				<input {...getInputProps()} />
				<p>
					Drag and drop files here, or click to select files (up to 100 files).
				</p>
			</div>
			<div>
				<h2>Uploaded Files:</h2>
				{uploadedFiles.length > 0 ? (
					<ul>
						{uploadedFiles.map((fileName, index) => (
							<li key={index}>{fileName}</li>
						))}
					</ul>
				) : (
					<p>No files uploaded yet.</p>
				)}
			</div>
		</div>
	)
}

const dropzoneStyles = {
	border: '2px dashed #ccc',
	borderRadius: '4px',
	padding: '20px',
	textAlign: 'center',
	cursor: 'pointer',
}

export default YandexDiskUploader
