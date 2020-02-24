<?php
    require_once('conexao.php');
    
    class ProprietarioModel extends Conexao {
        public $id_proprietario;
        public $nome;
        public $email;
        public $telefone;
        public $dia_repasse;
        public $string_busca;
        
        function inserir_alterar(){
            if ($this->id_proprietario == 0){
                $sql = "insert into sys.proprietario (
                            nome,
                            email,
                            telefone,
                            dia_repasse)
                        values (
                            '$this->nome',
                            '$this->email',
                            '$this->telefone',
                             $this->dia_repasse
                        );";
            } else {
                $sql = "update sys.proprietario set 
                            nome        = '$this->nome',
                            email       = '$this->email',
                            telefone    = '$this->telefone',
                            dia_repasse =  $this->dia_repasse
                        where 
                            id_proprietario = '$this->id_proprietario';";
            }
            return mysqli_query($this->conect, $sql);
        }

        function getProprietario(){
            if ($this->id_proprietario > 0){
                $sql = "select * from sys.proprietario where id_proprietario='$this->id_proprietario';";
            } else {
                $sql = "select * from sys.proprietario 
                        where 
                            nome like '%$this->string_busca%' or 
                            email like '%$this->string_busca%' or
                            telefone like '%$this->string_busca%' 
                        limit 50;";
            }
            $result = mysqli_query($this->conect, $sql);

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret;
        }

        function sql($sql){
			mysqli_set_charset('utf8');
			return mysqli_query($this->conect, $sql);
        }
    }