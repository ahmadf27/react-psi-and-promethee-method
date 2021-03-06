import React, { memo } from 'react'
import { Box, Table } from 'libs'
import {
    cekBobotPekerjaan,
    cekBobotPenghasilan,
    cekBobotJenisBantuan,
    cekBobotStatusSiswa
} from 'shared/utils'

const TableHasilAkhir = ({ dataAlternatif }) => {
    const totalBobotPekerjaan = () => {
        const totalList = dataAlternatif.map(
            (item) => parseInt(cekBobotPekerjaan(item.pekerjaan)) / 4
        )
        const totalResult = totalList.reduce((acc, curr) => acc + curr, 0)

        return totalResult / dataAlternatif.length
    }

    const totalBobotPenghasilan = () => {
        const totalList = dataAlternatif.map(
            (item) => 1 / parseInt(cekBobotPenghasilan(item.penghasilan))
        )
        const totalResult = totalList.reduce((acc, curr) => acc + curr, 0)

        return totalResult / dataAlternatif.length
    }

    const totalBobotJenisBantuan = () => {
        const totalList = dataAlternatif.map(
            (item) => parseInt(cekBobotJenisBantuan(item.jenis_bantuan)) / 4
        )
        const totalResult = totalList.reduce((acc, curr) => acc + curr, 0)

        return totalResult / dataAlternatif.length
    }

    const totalBobotStatusSiswa = () => {
        const totalList = dataAlternatif.map(
            (item) => parseInt(cekBobotStatusSiswa(item.status_siswa)) / 4
        )
        const totalResult = totalList.reduce((acc, curr) => acc + curr, 0)

        return totalResult / dataAlternatif.length
    }

    const totalVariasiPreferensi = () => {
        const pekerjaan = dataAlternatif.map(item => {
            return Math.pow(
                cekBobotPekerjaan(item.pekerjaan) - totalBobotPekerjaan(),
                2
            )
        })
        const jumlahPekerjaan = pekerjaan.reduce((acc, curr) => acc + curr, 0)

        const penghasilan = dataAlternatif.map(item => {
            return Math.pow(
                cekBobotPenghasilan(item.penghasilan) - totalBobotPenghasilan(),
                2
            )
        })
        const jumlahPenghasilan = penghasilan.reduce((acc, curr) => acc + curr, 0)

        const jenisBantuan = dataAlternatif.map(item => {
            return Math.pow(
                cekBobotJenisBantuan(item.jenis_bantuan) - totalBobotJenisBantuan(),
                2
            )
        })
        const jumlahJenisBantuan = jenisBantuan.reduce((acc, curr) => acc + curr, 0)

        const statusSiswa = dataAlternatif.map(item => {
            return Math.pow(
                cekBobotStatusSiswa(item.status_siswa) - totalBobotStatusSiswa(),
                2
            )
        })
        const jumlahStatusSiswa = statusSiswa.reduce((acc, curr) => acc + curr, 0)

        return {
            jumlahPekerjaan,
            jumlahPenghasilan,
            jumlahJenisBantuan,
            jumlahStatusSiswa
        }
    }

    const total = () => {
        const {
            jumlahPekerjaan,
            jumlahPenghasilan,
            jumlahJenisBantuan,
            jumlahStatusSiswa
        } = totalVariasiPreferensi()

        const kriteria = {
            jumlahPekerjaan,
            jumlahPenghasilan,
            jumlahJenisBantuan,
            jumlahStatusSiswa
        }

        const nilaiKriteria = Object.values(kriteria)
        const result = nilaiKriteria.reduce((acc, curr) => acc + curr, 0)

        return result
    }

    const psiPekerjaan = (item) => {
        const bobot = parseInt(cekBobotPekerjaan(item))/4
        const kriteriaBobot = totalVariasiPreferensi().jumlahPekerjaan / total()
        const hasil = 1 * bobot * kriteriaBobot

        return hasil
    }

    const psiPenghasilan = (item) => {
        const bobot = parseInt(cekBobotPenghasilan(item))/4
        const kriteriaBobot = totalVariasiPreferensi().jumlahPenghasilan / total()
        const hasil = 1 * bobot * kriteriaBobot

        return hasil
    }

    const psiJenisBantuan = (item) => {
        const bobot = parseInt(cekBobotJenisBantuan(item))/4
        const kriteriaBobot = totalVariasiPreferensi().jumlahJenisBantuan / total()
        const hasil = 1 * bobot * kriteriaBobot

        return hasil
    }

    const psiStatusSiswa = (item) => {
        const bobot = parseInt(cekBobotStatusSiswa(item))/4
        const kriteriaBobot = totalVariasiPreferensi().jumlahStatusSiswa / total()
        const hasil = 1 * bobot * kriteriaBobot

        return hasil
    }

    const hasilAkhir = (item) => {
        const arr = [
            psiPekerjaan(item.pekerjaan),
            psiPenghasilan(item.penghasilan),
            psiJenisBantuan(item.jenis_bantuan),
            psiStatusSiswa(item.status_siswa),
        ]

        const jumlahArr = arr.reduce((acc, curr) => acc + curr, 0)

        return jumlahArr
    }

    const getHasilAkhir = () => {
        const dataArr = dataAlternatif.map((item, index) => {
            item.nilai = hasilAkhir(item)

            return item
        })

        const sortNilai = dataArr.sort((a, b) => b.nilai - a.nilai)

        return sortNilai
    }

    return (
    	<Box>
    		<Table>
    			<thead>
    				<tr>
                        <td>NISN</td>
    					<td>Nama</td>
                        <td>Kelas</td>
    					<td>Nilai</td>
    					<td>Ranking</td>
    				</tr>
    			</thead>
                <tbody>
                    {getHasilAkhir().map((item, index) => (
                        <tr key={index}>
                            <td>{item.nisn}</td>
                            <td>{item.alternatif}</td>
                            <td>{item.kelas}</td>
                            <td>{item.nilai}</td>
                            <td>{index+1}</td>
                        </tr>
                    ))}
                </tbody>
    		</Table>
    	</Box>
	)
}

export default memo(TableHasilAkhir)
