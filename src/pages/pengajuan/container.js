import React, { memo, useState, useEffect, useRef, Fragment } from 'react'
import { Button, Input } from 'libs'
import { Helmet } from 'react-helmet'
import { API_URL } from 'constant'
import axios from 'axios'
import ReactToPrint from 'react-to-print'
import './style.scss'

import ModalBuatPengajuan from './views/modal-buat-pengajuan'
import ModalDeletePengajuan from './views/modal-delete-pengajuan'
import TablePengajuan from './views/table'
import Print from './views/print'

const Pengajuan = () => {
    const defaultFormData = {
        nisn: '',
        alternatif: '', // Nama Lengkap
        kelas: '',
        jurusan: '', // Kejuruan
        pekerjaan: '',
        penghasilan: '',
        status_siswa: '',
        jenis_bantuan: ''
    }
    const defaultModalDeletePengajuan = {
        isShow: false,
        itemId: null
    }
    const printRef = useRef()
    const [dataToPrint, setDataToPrint] = useState('')
    const [dataPekerjaan, setDataPekerjaan] = useState([])
    const [dataPengajuan, setDataPengajuan] = useState([])
    const [formData, setFormData] = useState(defaultFormData)
    const [dataPenghasilan, setDataPenghasilan] = useState([])
    const [dataProgramBantuan, setDataProgramBantuan] = useState([])
    const [dataStatusSiswa, setDataStatusSiswa] = useState([])
    const [dataJurusan, setDataJurusan] = useState([])
    const [showModalPengajuan, setShowModalPengajuan] = useState(false)
    const [modalType, setModalType] = useState('BUAT')
    const [idPengajuan, setIdPengajuan] = useState(null)
    const [modalDeletePengajuan, setModalDeletePengajuan] = useState(defaultModalDeletePengajuan)

    const handleChangeInputForm = (e) => {
        const { name, value } = e.target

        setFormData((prevValue) => ({
            ...prevValue,
            [name]: value
        }))
    }

    const handleBuatPengajuan = () => {
        axios
            .post(`${API_URL}/pengajuan`, formData)
            .then((res) => {
                if (res) {
                    alert('Berhasil buat pengajuan baru')
                    handleModalPengajuan()
                    fetchInitialMasterData()
                    setFormData(defaultFormData)
                }
            })
            .catch((err) => console.log(err))
    }

    const handleEditPengajuan = () => {
        if (idPengajuan) {
            axios
                .put(`${API_URL}/pengajuan/${idPengajuan}`, formData)
                .then((res) => {
                    if (res) {
                        alert('Berhasil edit pengajuan')
                        handleModalPengajuan()
                        fetchInitialMasterData()
                        setFormData(defaultFormData)
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    const handleEditItem = (id) => {
        setModalType('EDIT')
        handleModalPengajuan()

        axios
            .get(`${API_URL}/pengajuan/${id}`)
            .then((res) => {
                const { data } = res
                if (data) {
                    setIdPengajuan(data.id)
                    setFormData((prevValue) => ({
                        ...prevValue,
                        nisn: data.nisn,
                        alternatif: data.alternatif,
                        kelas: data.kelas,
                        jurusan: data.jurusan,
                        pekerjaan: data.pekerjaan,
                        penghasilan: data.penghasilan,
                        status_siswa: data.status_siswa,
                        jenis_bantuan: data.jenis_bantuan,
                    }))
                }
            })
            .catch((err) => console.log(err))
    }

    const handleDeletePengajuan = (id) => {
        axios
            .delete(`${API_URL}/pengajuan/${id}`)
            .then((res) => {
                const { status } = res
                if (status === 200) {
                    alert('Berhasil hapus data')
                    setIdPengajuan(null)
                    setModalDeletePengajuan(defaultModalDeletePengajuan)
                    setFormData(defaultFormData)
                    setShowModalPengajuan(false)
                    fetchInitialMasterData()
                }
            })  
            .catch((err) => console.log(err))
    }

    const handleModalPengajuan = () => {
        if (modalType === 'BUAT') {
            setShowModalPengajuan(!showModalPengajuan)
        } else {
            setShowModalPengajuan(!showModalPengajuan)
            setFormData(defaultFormData)
        }
    }

    const handleModalDeletePengajuan = (itemId) => {
        setModalDeletePengajuan(prevValue => ({
            ...prevValue,
            isShow: !prevValue.isShow,
            itemId
        }))
    }

    const fetchDataPengajuan = () => {
        axios
            .get(`${API_URL}/pengajuan`)
            .then((res) => {
                if (res.data) {
                    setDataPengajuan(res.data)
                    setDataToPrint(res?.data?.length)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchDataPekerjaan = () => {
        axios
            .get(`${API_URL}/pekerjaan`)
            .then((res) => {
                if (res.data) {
                    let initialArr = []

                    res.data.map((item) => {
                        initialArr.push({
                            value: item.sub_kriteria,
                            text: item.sub_kriteria
                        })
                    })
                    setDataPekerjaan(initialArr)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchDataPenghasilan = () => {
        axios
            .get(`${API_URL}/penghasilan`)
            .then((res) => {
                if (res.data) {
                    let initialArr = []

                    res.data.map((item) => {
                        initialArr.push({
                            value: item.sub_kriteria,
                            text: item.sub_kriteria
                        })
                    })
                    setDataPenghasilan(initialArr)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchDataStatusSiswa = () => {
        axios
            .get(`${API_URL}/status-siswa`)
            .then((res) => {
                if (res.data) {
                    let initialArr = []

                    res.data.map((item) => {
                        initialArr.push({
                            value: item.sub_kriteria,
                            text: item.sub_kriteria
                        })
                    })
                    setDataStatusSiswa(initialArr)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchDataJurusan = () => {
        axios
            .get(`${API_URL}/jurusan`)
            .then((res) => {
                if (res.data) {
                    let initialArr = []

                    res.data.map((item) => {
                        initialArr.push({
                            value: item.alias,
                            text: item.alias
                        })
                    })
                    setDataJurusan(initialArr)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchDataProgramBantuan = () => {
        axios
            .get(`${API_URL}/program-bantuan`)
            .then((res) => {
                if (res.data) {
                    let initialArr = []

                    res.data.map((item) => {
                        initialArr.push({
                            value: item.sub_kriteria,
                            text: item.sub_kriteria
                        })
                    })
                    setDataProgramBantuan(initialArr)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchInitialMasterData = () => {
        fetchDataPengajuan()
        fetchDataPekerjaan()
        fetchDataPenghasilan()
        fetchDataStatusSiswa()
        fetchDataJurusan()
        fetchDataProgramBantuan()
    }

    useEffect(() => {
        fetchInitialMasterData()
    }, [])

    return (
        <Fragment>
            <Helmet title='Pengajuan | SPK' />
            <div className='level mb-5'>
                <div className='level-left has-text-weight-medium is-size-5 has-text-black'>
                    Pengajuan
                </div>
                <div className='level-right'>
                    <Button
                        className='is-primary'
                        onClick={() => {
                            setModalType('BUAT')
                            handleModalPengajuan()
                        }}
                    >
                        Buat Pengajuan Baru
                    </Button>
                    <Input
                        className='mx-3 mt-4'
                        name='dataToPrint'
                        placeholder='Input data to print'
                        type='number'
                        value={dataToPrint}
                        onChange={e => setDataToPrint(e.target.value)}
                        style={{
                            width: 100
                        }}
                    />
                    <ReactToPrint
                        content={() => printRef.current}
                        trigger={() => (
                            <Button
                                className='is-info is-disabled ml-3'
                                disabled={dataToPrint === '' || dataToPrint <= 0}
                            >
                                Print
                            </Button>
                        )}
                    />
                </div>
            </div>

            <div style={{ display: 'none' }}>
                <Print
                    ref={printRef}
                    data={dataPengajuan}
                    dataToPrint={dataToPrint}
                />
            </div>

            <ModalBuatPengajuan
                dataPekerjaan={dataPekerjaan}
                dataPenghasilan={dataPenghasilan}
                dataStatusSiswa={dataStatusSiswa}
                dataJurusan={dataJurusan}
                dataProgramBantuan={dataProgramBantuan}
                formData={formData}
                handleBuatPengajuan={handleBuatPengajuan}
                handleChangeInputForm={handleChangeInputForm}
                handleEditPengajuan={handleEditPengajuan}
                handleModalPengajuan={handleModalPengajuan}
                isShow={showModalPengajuan}
                modalType={modalType}
            />

            <ModalDeletePengajuan
                modalAttr={modalDeletePengajuan}
                handleModalDeletePengajuan={handleModalDeletePengajuan}
                handleDeletePengajuan={handleDeletePengajuan}
            />

            <TablePengajuan
                dataPengajuan={dataPengajuan}
                handleModalDeletePengajuan={handleModalDeletePengajuan}
                handleEditItem={handleEditItem}
            />
        </Fragment>
    )
}

export default memo(Pengajuan)
